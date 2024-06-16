package service

import (
	"authorization/internal/adapter/config"
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"authorization/internal/core/port"
	"authorization/pkg/authenticator"
	"authorization/pkg/crypto"
	"authorization/pkg/email"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)

type UserService struct {
	config       *config.Config
	repository   port.UserRepository
	tokenService port.TokenService
}

func NewUserService(
	config *config.Config,
	repository port.UserRepository,
	tokenService port.TokenService,
) port.UserService {
	return &UserService{
		config:       config,
		repository:   repository,
		tokenService: tokenService,
	}
}

func (service *UserService) SignUp(ctx context.Context, dto dto.SignUpInput) (*port.UserID, error) {
	_, err := service.repository.GetByEmail(ctx, dto.Email)
	if err == nil {
		return nil, domain.ErrEmailOccupied
	}

	if err != domain.ErrNotFound {
		return nil, domain.ErrInternal
	}

	hashedPassword, err := crypto.HashPassword(dto.Password)
	if err != nil {
		return nil, domain.ErrInternal
	}

	nowTime := time.Now().UTC()
	newUser := domain.User{
		ID:             uuid.NewString(),
		Name:           dto.Name,
		Email:          dto.Email,
		Secret:         uuid.NewString(),
		IsVerified:     false,
		CreatedAt:      nowTime,
		LastLoginAt:    nowTime,
		HashedPassword: hashedPassword,
	}

	err = service.repository.Save(ctx, &newUser)
	if err != nil {
		return nil, domain.ErrInternal
	}

	go func() {
		if err = service.sendSignUpVerificationCode(ctx, &newUser); err != nil {
			log.Fatal(err)
			// send to broker for retry
		}
	}()

	return (*port.UserID)(&newUser.ID), nil
}

func (service *UserService) SignIn(ctx context.Context, dto dto.SignInInput) (*port.UserID, error) {
	user, err := service.repository.GetByEmail(ctx, dto.Email)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrInvalidLoginOrPassword
		}

		return nil, domain.ErrInternal
	}

	if err := crypto.CheckPassword(dto.Password, user.HashedPassword); err != nil {
		return nil, domain.ErrInvalidLoginOrPassword
	}

	return (*port.UserID)(&user.ID), nil
}

func (service *UserService) RefreshToken(ctx context.Context, dto dto.RefreshTokenInput) (*dto.TokenPairOutput, error) {
	tokenPair, err := service.tokenService.RefreshPair(ctx, dto.RefreshToken)
	if err != nil {
		return nil, err
	}

	return tokenPair, nil
}

func (service *UserService) Logout(ctx context.Context, refreshToken string) error {
	err := service.tokenService.Revoke(ctx, refreshToken)
	if err != nil {
		return domain.ErrInternal
	}

	return nil
}

func (service *UserService) VerifySignUp(ctx context.Context, dto dto.VerifyInput) error {
	user, err := service.repository.GetByID(ctx, dto.UserID)
	if err != nil {
		if err == domain.ErrNotFound {
			return err
		}

		return domain.ErrInternal
	}

	if user.IsVerified {
		return domain.ErrUserAlreadyVerified
	}

	if err := user.CheckVerificationCode(dto.Code); err != nil {
		return err
	}

	user.IsVerified = true
	service.repository.Save(ctx, user)

	return nil
}

func (service *UserService) VerifySignIn(ctx context.Context, dto dto.VerifyInput) (*dto.TokenPairOutput, error) {
	user, err := service.repository.GetByID(ctx, dto.UserID)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, err
		}

		return nil, domain.ErrInternal
	}

	isCodeValid, err := authenticator.ValidateCode(dto.Code, user.Secret)
	if err != nil {
		return nil, domain.ErrInternal
	}

	if !isCodeValid {
		return nil, domain.ErrInvalidCode
	}

	tokenPair, err := service.tokenService.IssuePair(ctx, user.ID, dto.DeviceID)
	if err != nil {
		return nil, domain.ErrInternal
	}

	return tokenPair, nil
}

func (service *UserService) sendSignUpVerificationCode(ctx context.Context, user *domain.User) error {
	code := user.IssueVerificationCode()
	err := service.repository.Save(ctx, user)
	if err != nil {
		return err
	}

	err = email.SendEmail(email.Email{
		SmtpHost:     service.config.MailHost,
		SmtpPort:     service.config.MailPort,
		From:         service.config.MailFrom,
		FromPassword: service.config.MailPassword,
		To:           user.Email,
		Subject:      "Верификация аккаунта на NetDisk",
		Body:         fmt.Sprintf("Код для верификации: %s", code),
	})

	return err
}

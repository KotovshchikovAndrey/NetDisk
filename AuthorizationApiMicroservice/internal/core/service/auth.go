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

type AuthService struct {
	config       *config.Config
	repository   port.UserRepository
	tokenService port.TokenService
}

func NewAuthService(
	config *config.Config,
	repository port.UserRepository,
	tokenService port.TokenService,
) port.AuthService {
	return &AuthService{
		config:       config,
		repository:   repository,
		tokenService: tokenService,
	}
}

func (service *AuthService) SignUp(ctx context.Context, input dto.SignUpInput) (*dto.SignUpOutput, error) {
	_, err := service.repository.GetByEmail(ctx, input.Email)
	if err == nil {
		return nil, domain.ErrEmailOccupied
	}

	if err != domain.ErrNotFound {
		return nil, err
	}

	hashedPassword, err := crypto.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	nowTime := time.Now().UTC()
	newUser := domain.User{
		ID:             uuid.NewString(),
		Name:           input.Name,
		Email:          input.Email,
		Secret:         uuid.NewString(),
		IsVerified:     false,
		CreatedAt:      nowTime,
		LastLoginAt:    nowTime,
		HashedPassword: hashedPassword,
	}

	err = service.repository.Save(ctx, &newUser)
	if err != nil {
		return nil, err
	}

	// TODO:
	// How about create util / helper from this code?
	go func() {
		if err = service.sendSignUpVerificationCode(ctx, &newUser); err != nil {
			log.Fatal(err)
			// send to broker for retry
		}
	}()

	return &dto.SignUpOutput{UserID: newUser.ID}, nil
}

func (service *AuthService) SignIn(ctx context.Context, input dto.SignInInput) (*dto.SignInOutput, error) {
	user, err := service.repository.GetByEmail(ctx, input.Email)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrInvalidLoginOrPassword
		}

		return nil, err
	}

	if err := crypto.CheckPassword(input.Password, user.HashedPassword); err != nil {
		return nil, domain.ErrInvalidLoginOrPassword
	}

	if user.Is2faEnabled() {
		return &dto.SignInOutput{UserID: user.ID, TokenPair: nil}, nil
	}

	tokenPair, err := service.tokenService.IssuePair(ctx, user.ID, input.DeviceID)
	if err != nil {
		return nil, err
	}

	return &dto.SignInOutput{UserID: user.ID, TokenPair: tokenPair}, nil
}

func (service *AuthService) RefreshToken(ctx context.Context, input dto.RefreshTokenInput) (*dto.TokenPairOutput, error) {
	tokenPair, err := service.tokenService.RefreshPair(ctx, input.RefreshToken)
	if err != nil {
		return nil, err
	}

	return tokenPair, nil
}

func (service *AuthService) SignOut(ctx context.Context, refreshToken string) {
	err := service.tokenService.Revoke(ctx, refreshToken)
	if err != nil {
		log.Fatal(err)
		// send to broker for retry
	}
}

func (service *AuthService) VerifySignUp(ctx context.Context, input dto.VerifyInput) error {
	user, err := service.repository.GetByID(ctx, input.UserID)
	if err != nil {
		return err
	}

	if user.IsVerified {
		return domain.ErrUserAlreadyVerified
	}

	if err := user.CheckVerificationCode(input.Code); err != nil {
		return err
	}

	user.IsVerified = true
	service.repository.Save(ctx, user)

	return nil
}

func (service *AuthService) ResendVerificationCode(ctx context.Context, userId string) error {
	user, err := service.repository.GetByID(ctx, userId)
	if err != nil {
		return err
	}

	if user.IsVerified {
		return domain.ErrUserAlreadyVerified
	}

	// TODO:
	// How about create util / helper from this code?
	go func() {
		if err = service.sendSignUpVerificationCode(ctx, user); err != nil {
			log.Fatal(err)
			// send to broker for retry
		}
	}()

	return nil
}

func (service *AuthService) VerifySignIn(ctx context.Context, input dto.VerifyInput) (*dto.TokenPairOutput, error) {
	user, err := service.repository.GetByID(ctx, input.UserID)
	if err != nil {
		return nil, err
	}

	if !user.IsVerified {
		return nil, domain.ErrUserUnverified
	}

	isCodeValid, err := authenticator.ValidateCode(input.Code, user.Secret)
	if err != nil {
		return nil, err
	}

	if !isCodeValid {
		return nil, domain.ErrInvalidCode
	}

	tokenPair, err := service.tokenService.IssuePair(ctx, user.ID, input.DeviceID)
	if err != nil {
		return nil, err
	}

	return tokenPair, nil
}

func (service *AuthService) sendSignUpVerificationCode(ctx context.Context, user *domain.User) error {
	code := user.IssueCode(domain.VerifySignUp)
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

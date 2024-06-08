package service

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"authorization/internal/core/port"
	"authorization/pkg/crypto"
	"context"
	"time"

	"github.com/google/uuid"
)

type UserService struct {
	repository   port.UserRepository
	tokenService port.TokenService
	codeService  port.CodeService
}

func NewUserService(
	repository port.UserRepository,
	tokenService port.TokenService,
	codeService port.CodeService,
) port.UserService {
	return &UserService{
		repository:   repository,
		tokenService: tokenService,
		codeService:  codeService,
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
		IsVerified:     false,
		CreatedAt:      nowTime,
		LastLoginAt:    nowTime,
		HashedPassword: hashedPassword,
	}

	err = service.repository.Save(ctx, newUser)
	if err != nil {
		return nil, domain.ErrInternal
	}

	err = service.codeService.SendVerificationCode(ctx, newUser)
	if err != nil {
		return nil, domain.ErrInternal
	}

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

	err = service.codeService.SendSignInCode(ctx, *user, dto.DeviceID)
	if err != nil {
		return nil, domain.ErrInternal
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

func (service *UserService) Verify(ctx context.Context, dto dto.VerifyInput) error {
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

	code, err := service.codeService.CheckVerificationCode(ctx, dto.Code, *user)
	if err != nil {
		if err == domain.ErrInvalidCode {
			return err
		}

		return domain.ErrInternal
	}

	go service.codeService.Revoke(ctx, *code)

	user.IsVerified = true
	service.repository.Save(ctx, *user)

	return nil
}

func (service *UserService) ConfirmSignIn(ctx context.Context, dto dto.ConfirmSignInInput) (*dto.TokenPairOutput, error) {
	user, err := service.repository.GetByID(ctx, dto.UserID)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, err
		}

		return nil, domain.ErrInternal
	}

	code, err := service.codeService.CheckSignInCode(ctx, dto.Code, *user, dto.DeviceID)
	if err != nil {
		if err == domain.ErrInvalidCode {
			return nil, err
		}

		return nil, err
	}

	go service.codeService.Revoke(ctx, *code)

	tokenPair, err := service.tokenService.IssuePair(ctx, user.ID, dto.DeviceID)
	if err != nil {
		return nil, domain.ErrInternal
	}

	return tokenPair, nil
}

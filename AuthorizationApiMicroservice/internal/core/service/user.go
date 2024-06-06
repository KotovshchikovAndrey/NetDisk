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

// 	TODO:
// 	Logout(ctx context.Context, refreshToken string) error
// 	ConfirmSignIn(ctx context.Context, dto dto.ConfirmSignInInput) (*dto.TokenPairOutput, error)
// 	Verify(ctx context.Context, dto dto.VerifyInput) error

type UserService struct {
	repository   port.UserRepository
	tokenService port.TokenService
	codeService  port.CodeService
}

func NewUserService(
	repository port.UserRepository,
	tokenService port.TokenService,
	codeService port.CodeService,
) *UserService {
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
			return nil, err
		}

		return nil, domain.ErrInternal
	}

	if err := crypto.CheckPassword(dto.Password, user.HashedPassword); err != nil {
		return nil, domain.ErrUnauthorized
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

package port

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"context"
)

type UserID string

type UserService interface {
	SignUp(ctx context.Context, dto dto.SignUpInput) (*UserID, error)
	SignIn(ctx context.Context, dto dto.SignInInput) (*UserID, error)
	RefreshToken(ctx context.Context, dto dto.RefreshTokenInput) (*dto.TokenPairOutput, error)
	Logout(ctx context.Context, refreshToken string) error
	ConfirmSignIn(ctx context.Context, dto dto.ConfirmSignInInput) (*dto.TokenPairOutput, error)
	Verify(ctx context.Context, dto dto.VerifyInput) error
}

type UserRepository interface {
	GetByID(ctx context.Context, id string) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Save(ctx context.Context, user domain.User) error
	SetOption(ctx context.Context, userId string, option *domain.UserOption)
}

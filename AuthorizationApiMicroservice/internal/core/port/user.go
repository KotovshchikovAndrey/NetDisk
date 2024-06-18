package port

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"context"
)

type UserService interface {
	SignUp(ctx context.Context, input dto.SignUpInput) (*dto.SignUpOutput, error)
	SignIn(ctx context.Context, input dto.SignInInput) (*dto.SignInOutput, error)
	RefreshToken(ctx context.Context, input dto.RefreshTokenInput) (*dto.TokenPairOutput, error)
	SignOut(ctx context.Context, refreshToken string) error
	VerifySignUp(ctx context.Context, input dto.VerifyInput) error
	VerifySignIn(ctx context.Context, input dto.VerifyInput) (*dto.TokenPairOutput, error)
}

type UserRepository interface {
	GetByID(ctx context.Context, id string) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Save(ctx context.Context, user *domain.User) error
}

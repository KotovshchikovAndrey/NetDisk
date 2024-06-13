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
	VerifySignUp(ctx context.Context, dto dto.VerifyInput) error
	VerifySignIn(ctx context.Context, dto dto.VerifyInput) (*dto.TokenPairOutput, error)
}

type UserRepository interface {
	GetByID(ctx context.Context, id string) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	GetCode(ctx context.Context, userId string, purpose domain.CodePurpose) (*domain.Code, error)
	Save(ctx context.Context, user *domain.User) error
	SaveCode(ctx context.Context, code *domain.Code) error
	SaveOption(ctx context.Context, userId string, option *domain.UserOption) error
	RemoveCode(ctx context.Context, id string) error
}

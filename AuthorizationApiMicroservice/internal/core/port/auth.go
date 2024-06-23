package port

import (
	"authorization/internal/core/dto"
	"context"
)

type AuthService interface {
	SignUp(ctx context.Context, input dto.SignUpInput) (*dto.SignUpOutput, error)
	SignIn(ctx context.Context, input dto.SignInInput) (*dto.SignInOutput, error)
	RefreshToken(ctx context.Context, input dto.RefreshTokenInput) (*dto.TokenPairOutput, error)
	SignOut(ctx context.Context, refreshToken string)
	VerifySignUp(ctx context.Context, input dto.VerifyInput) error
	ResendVerificationCode(ctx context.Context, userId string) error
	VerifySignIn(ctx context.Context, input dto.VerifyInput) (*dto.TokenPairOutput, error)
}

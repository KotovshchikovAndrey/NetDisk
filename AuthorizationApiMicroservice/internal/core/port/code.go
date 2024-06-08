package port

import (
	"authorization/internal/core/domain"
	"context"
)

type CodeService interface {
	SendVerificationCode(ctx context.Context, user domain.User) error
	CheckVerificationCode(ctx context.Context, codeString string, user domain.User) (*domain.Code, error)
	SendSignInCode(ctx context.Context, user domain.User, deviceId string) error
	CheckSignInCode(ctx context.Context, codeString string, user domain.User, deviceId string) (*domain.Code, error)
	Revoke(ctx context.Context, code domain.Code)
}

type CodeQuery struct {
	UserID   *string
	DeviceID *string
	Pursone  domain.CodePurpose
}

type CodeRepository interface {
	GetOne(ctx context.Context, query CodeQuery) (*domain.Code, error)
	Save(ctx context.Context, code domain.Code) error
	Remove(ctx context.Context, code domain.Code) error
}

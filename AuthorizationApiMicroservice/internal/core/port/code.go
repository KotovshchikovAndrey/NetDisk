package port

import (
	"authorization/internal/core/domain"
	"context"
)

type CodeService interface {
	SendVerificationCode(ctx context.Context, user domain.User) error
	CheckVerificationCode(ctx context.Context, user domain.User) error
	SendSignInCode(ctx context.Context, user domain.User, deviceId string) error
	CheckSignInCode(ctx context.Context, user domain.User, deviceId string) error
}

type CodeQuery struct {
	UserID   *string
	DeviceID *string
	Pursone  *domain.CodePurpose
}

type CodeRepository interface {
	GetOne(ctx context.Context, query CodeQuery) (*domain.Code, error)
	Save(ctx context.Context, code domain.Code) error
	RemoveAll(ctx context.Context, query CodeQuery) error
}

package port

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"context"
)

type TokenService interface {
	IssuePair(ctx context.Context, user domain.User, deviceId string) (*dto.TokenPairOutput, error)
	RefreshPair(ctx context.Context, refreshToken string) (*dto.TokenPairOutput, error)
	RevokeAll(ctx context.Context, user domain.User) error
}

type TokenRepository interface {
	GetByID(ctx context.Context, id string) (*domain.Token, error)
	Save(ctx context.Context, token domain.Token) error
	RevokeByUserDevice(ctx context.Context, user domain.User, deviceId string) error
	RevokeByUser(ctx context.Context, user domain.User) error
}

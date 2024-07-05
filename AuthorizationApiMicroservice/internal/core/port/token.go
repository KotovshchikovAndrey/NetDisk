package port

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"context"
)

type TokenService interface {
	IssuePair(ctx context.Context, userId string, deviceId string) (*dto.TokenPairOutput, error)
	RefreshPair(ctx context.Context, refreshToken string) (*dto.TokenPairOutput, error)
	Revoke(ctx context.Context, refreshToken string) error
	RevokeAll(ctx context.Context, userId string) error
}

type TokenRepository interface {
	GetByID(ctx context.Context, id string) (*domain.Token, error)
	Save(ctx context.Context, token *domain.Token) error
	RevokeByUserDevice(ctx context.Context, userId string, deviceId string) error
	RevokeByUser(ctx context.Context, userId string) error
	RemoveExpired(ctx context.Context) error
}

package port

import (
	"authorization/internal/core/domain"
	"context"
)

type SessionService interface {
	Get(ctx context.Context, key string) (*domain.Session, error)
	Create(ctx context.Context, userId string) (*domain.Session, error)
	Delete(ctx context.Context, key string) error
}

type SessionStorage interface {
	GetByKey(ctx context.Context, key string) (*domain.Session, error)
	Save(ctx context.Context, session *domain.Session) error
	DeleteByKey(ctx context.Context, key string) error
}

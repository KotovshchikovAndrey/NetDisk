package service

import (
	core_config "authorization/internal/core/config"
	"authorization/internal/core/domain"
	"authorization/internal/core/port"
	"context"
	"log"
	"time"

	"github.com/google/uuid"
)

type SessionService struct {
	storage port.SessionStorage
}

func NewSessionService(storage port.SessionStorage) port.SessionService {
	return &SessionService{storage: storage}
}

func (service *SessionService) Get(ctx context.Context, key string) (*domain.Session, error) {
	session, err := service.storage.GetByKey(ctx, key)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrSessionExpired
		}

		return nil, err
	}

	if session.IsExired() {
		return nil, domain.ErrSessionExpired
	}

	return session, nil
}

func (service *SessionService) Create(ctx context.Context, userId string) (*domain.Session, error) {
	newSession := &domain.Session{
		Key:       uuid.NewString(),
		UserID:    userId,
		ExpiredAt: time.Now().Add(core_config.SessionTtl * time.Second),
	}

	if err := service.storage.Save(ctx, newSession); err != nil {
		return nil, err
	}

	return newSession, nil
}

func (service *SessionService) Delete(ctx context.Context, key string) {
	if err := service.storage.DeleteByKey(ctx, key); err != nil {
		log.Fatal(err)
		// send to broker for retry
	}
}

package redis

import (
	"authorization/internal/core/domain"
	"authorization/internal/core/port"
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionRedisRepository struct {
	client *redis.Client
}

func NewSessionRedisRepository(client *redis.Client) port.SessionStorage {
	return &SessionRedisRepository{client: client}
}

func (repository *SessionRedisRepository) GetByKey(ctx context.Context, key string) (*domain.Session, error) {
	data, err := repository.client.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return nil, domain.ErrNotFound
		}

		return nil, err
	}

	session := &domain.Session{}
	if err := json.Unmarshal([]byte(data), session); err != nil {
		return nil, err
	}

	return session, err
}

func (repository *SessionRedisRepository) Save(ctx context.Context, session *domain.Session) error {
	data, err := json.Marshal(session)
	if err != nil {
		return err
	}

	exp := time.Now().UTC().Sub(session.ExpiredAt)
	if err := repository.client.Set(ctx, session.Key, data, exp).Err(); err != nil {
		return err
	}

	return nil
}

func (repository *SessionRedisRepository) DeleteByKey(ctx context.Context, key string) error {
	if err := repository.client.Del(ctx, key).Err(); err != nil {
		return err
	}

	return nil
}

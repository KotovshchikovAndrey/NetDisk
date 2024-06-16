package service

import (
	core_config "authorization/internal/core/config"
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"authorization/internal/core/port"
	"authorization/pkg/jwt"
	"context"
	"time"

	"github.com/google/uuid"
)

type TokenService struct {
	repository port.TokenRepository
}

func NewTokenService(repository port.TokenRepository) port.TokenService {
	return &TokenService{repository: repository}
}

func (service *TokenService) IssuePair(ctx context.Context, userId string, deviceId string) (*dto.TokenPairOutput, error) {
	accessTokenPayload := jwt.Payload{
		Jti:     uuid.NewString(),
		Subject: userId,
		Iat:     time.Now().UTC().Unix(),
		Exp:     time.Now().UTC().Add(time.Second * core_config.AccessTokenTtl).Unix(),
	}

	accessToken, err := jwt.GenerateJwt(accessTokenPayload)
	if err != nil {
		return nil, domain.ErrInternal
	}

	createdAt := time.Now().UTC()
	expiredAt := createdAt.Add(time.Second * core_config.RefreshTokenTtl)

	refreshTokenPayload := jwt.Payload{
		Jti:     uuid.NewString(),
		Subject: userId,
		Iat:     createdAt.Unix(),
		Exp:     expiredAt.Unix(),
	}

	refreshToken, err := jwt.GenerateJwt(refreshTokenPayload)
	if err != nil {
		return nil, domain.ErrInternal
	}

	token := domain.Token{
		ID:        refreshTokenPayload.Jti,
		UserID:    refreshTokenPayload.Subject,
		CreatedAt: createdAt,
		ExpiredAt: expiredAt,
		DeviceID:  deviceId,
		IsRevoked: false,
	}

	if err := service.repository.Save(ctx, &token); err != nil {
		return nil, domain.ErrInternal
	}

	return &dto.TokenPairOutput{Accesstoken: accessToken, Refreshtoken: refreshToken}, nil
}

func (service *TokenService) RefreshPair(ctx context.Context, refreshToken string) (*dto.TokenPairOutput, error) {
	payload, err := jwt.TryDecodeJwt(refreshToken)
	if err != nil {
		switch err {

		case jwt.ErrInvalidToken:
			return nil, domain.ErrInvalidToken

		case jwt.ErrExpiredToken:
			return nil, domain.ErrTokenExpired

		default:
			return nil, domain.ErrInternal
		}
	}

	token, err := service.repository.GetByID(ctx, payload.Jti)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrInvalidToken
		}

		return nil, domain.ErrInternal
	}

	if token.IsRevoked {
		if err := service.RevokeAll(ctx, token.UserID); err != nil {
			return nil, domain.ErrInternal
		}

		return nil, domain.ErrInvalidToken
	}

	if err := service.repository.RevokeByUserDevice(ctx, token.UserID, token.DeviceID); err != nil {
		return nil, domain.ErrInternal
	}

	newTokenPair, err := service.IssuePair(ctx, token.UserID, token.DeviceID)
	if err != nil {
		return nil, domain.ErrInternal
	}

	return newTokenPair, nil
}

func (service *TokenService) Revoke(ctx context.Context, refreshToken string) error {
	payload, err := jwt.TryDecodeJwt(refreshToken)
	if err == jwt.ErrInvalidToken {
		return nil // do nothing
	}

	token, err := service.repository.GetByID(ctx, payload.Jti)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil // do nothing
		}

		return err
	}

	if err := service.repository.RevokeByUserDevice(ctx, token.UserID, token.DeviceID); err != nil {
		return err
	}

	return nil
}

func (service *TokenService) RevokeAll(ctx context.Context, userId string) error {
	if err := service.repository.RevokeByUser(ctx, userId); err != nil {
		return err
	}

	return nil
}

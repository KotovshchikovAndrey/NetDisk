package service

import (
	"authorization/internal/adapter/config"
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
	config     *config.Config
	repository port.TokenRepository
}

func NewTokenService(config *config.Config, repository port.TokenRepository) port.TokenService {
	return &TokenService{config: config, repository: repository}
}

func (service *TokenService) IssuePair(ctx context.Context, userId string, deviceId string) (*dto.TokenPairOutput, error) {
	accessTokenPayload := jwt.Payload{
		Jti:     uuid.NewString(),
		Subject: userId,
		Iat:     time.Now().Unix(),
		Exp:     time.Now().Add(time.Second * core_config.AccessTokenTtl).Unix(),
	}

	accessToken, err := jwt.GenerateRS256Jwt(accessTokenPayload, service.config.JwtPrivateKey)
	if err != nil {
		return nil, err
	}

	createdAt := time.Now().UTC()
	expiredAt := createdAt.Add(time.Second * core_config.RefreshTokenTtl)

	refreshTokenPayload := jwt.Payload{
		Jti:     uuid.NewString(),
		Subject: userId,
		Iat:     createdAt.Unix(),
		Exp:     expiredAt.Unix(),
	}

	refreshToken, err := jwt.GenerateRS256Jwt(refreshTokenPayload, service.config.JwtPrivateKey)
	if err != nil {
		return nil, err
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
		return nil, err
	}

	return &dto.TokenPairOutput{Accesstoken: accessToken, Refreshtoken: refreshToken}, nil
}

func (service *TokenService) RefreshPair(ctx context.Context, refreshToken string) (*dto.TokenPairOutput, error) {
	payload, err := jwt.ValidateRS256Jwt(refreshToken, service.config.JwtPublicKey)
	if err != nil {
		switch err {

		case jwt.ErrInvalidToken:
			return nil, domain.ErrInvalidToken

		case jwt.ErrExpiredToken:
			return nil, domain.ErrTokenExpired

		default:
			return nil, err
		}
	}

	token, err := service.repository.GetByID(ctx, payload.Jti)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrInvalidToken
		}

		return nil, err
	}

	if token.IsRevoked {
		if err := service.RevokeAll(ctx, token.UserID); err != nil {
			return nil, err
		}

		return nil, domain.ErrInvalidToken
	}

	if err := service.repository.RevokeByUserDevice(ctx, token.UserID, token.DeviceID); err != nil {
		return nil, err
	}

	newTokenPair, err := service.IssuePair(ctx, token.UserID, token.DeviceID)
	if err != nil {
		return nil, err
	}

	return newTokenPair, nil
}

func (service *TokenService) Revoke(ctx context.Context, refreshToken string) error {
	payload, err := jwt.ValidateRS256Jwt(refreshToken, service.config.JwtPublicKey)
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

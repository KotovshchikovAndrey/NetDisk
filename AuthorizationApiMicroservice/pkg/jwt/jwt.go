package jwt

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("token expired")
)

type Payload struct {
	Jti     string
	Subject string
	Iat     int64
	Exp     int64
}

func GenerateRS256Jwt(payload Payload, privateKey string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"jti":     payload.Jti,
		"subject": payload.Subject,
		"iat":     payload.Iat,
		"exp":     payload.Exp,
	})

	key, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(privateKey))
	if err != nil {
		return "", err
	}

	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", nil
	}

	return tokenString, nil
}

func ValidateRS256Jwt(tokenString string, publicKey string) (*Payload, error) {
	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
	if err != nil {
		return nil, err
	}

	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
		return key, nil
	})

	if err != nil {
		return nil, err
	}

	payload, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrInvalidToken
	}

	exp := payload["exp"].(int64)
	if exp <= time.Now().Unix() {
		return nil, ErrExpiredToken
	}

	return &Payload{
		Jti:     payload["jti"].(string),
		Subject: payload["subject"].(string),
		Iat:     payload["iat"].(int64),
		Exp:     exp,
	}, nil
}

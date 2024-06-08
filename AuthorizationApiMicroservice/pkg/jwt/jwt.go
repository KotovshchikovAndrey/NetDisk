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

const publicKey = ""
const privateKey = ""

type Payload struct {
	Jti     string
	Subject string
	Iat     int64
	Exp     int64
}

func GenerateJwt(payload Payload) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"jti":     payload.Jti,
		"subject": payload.Subject,
		"iat":     payload.Iat,
		"exp":     payload.Exp,
	})

	tokenString, err := token.SignedString(privateKey)
	if err != nil {
		return "", nil
	}

	return tokenString, nil
}

func TryDecodeJwt(tokenString string) (*Payload, error) {
	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
		return publicKey, nil
	})

	if err != nil {
		return nil, err
	}

	payload, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrInvalidToken
	}

	exp := payload["exp"].(int64)
	if exp < time.Now().UTC().Unix() {
		return nil, ErrExpiredToken
	}

	return &Payload{
		Jti:     payload["jti"].(string),
		Subject: payload["subject"].(string),
		Iat:     payload["iat"].(int64),
		Exp:     exp,
	}, nil
}

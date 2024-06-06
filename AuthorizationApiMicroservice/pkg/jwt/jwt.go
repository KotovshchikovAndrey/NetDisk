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
	subject string
	iat     int64
	exp     int64
}

func GenerateJwt(subject string, ttl uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"subject": subject,
		"iat":     time.Now().UTC().Unix(),
		"exp":     time.Now().UTC().Add(time.Second * time.Duration(ttl)).Unix(),
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
		subject: payload["subject"].(string),
		iat:     payload["iat"].(int64),
		exp:     exp,
	}, nil
}

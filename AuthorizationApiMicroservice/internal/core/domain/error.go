package domain

import "errors"

var (
	ErrInternal               = errors.New("internal server error")
	ErrNotFound               = errors.New("not found error")
	ErrEmailOccupied          = errors.New("email occupied")
	ErrUnauthorized           = errors.New("unauthorized")
	ErrInvalidLoginOrPassword = errors.New("invalid login or password")
	ErrInvalidCode            = errors.New("invalid code")
	ErrUserAlreadyVerified    = errors.New("user already verified")
	ErrInvalidToken           = errors.New("invalid token")
	ErrTokenExpired           = errors.New("token expired")
)

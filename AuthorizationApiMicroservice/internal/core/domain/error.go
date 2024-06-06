package domain

import "errors"

var (
	ErrInternal      = errors.New("internal server error")
	ErrNotFound      = errors.New("not found error")
	ErrEmailOccupied = errors.New("email occupied")
	ErrUnauthorized  = errors.New("unauthorized")
)

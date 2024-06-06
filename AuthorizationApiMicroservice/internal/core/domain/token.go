package domain

import "time"

type Token struct {
	ID        string
	CreatedAt time.Time
	ExpiredAt time.Time
	UserID    string
	DeviceID  string
	IsRevoked bool
}

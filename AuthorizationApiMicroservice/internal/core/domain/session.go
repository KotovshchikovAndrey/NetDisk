package domain

import "time"

type Session struct {
	Key       string
	UserID    string
	ExpiredAt time.Time
}

func (session *Session) IsExired() bool {
	return session.ExpiredAt.Before(time.Now().UTC())
}

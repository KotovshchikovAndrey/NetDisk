package domain

import "time"

type Session struct {
	Key       string
	UserID    string
	ExpiredAt int64
}

func (session *Session) IsExired() bool {
	return session.ExpiredAt <= time.Now().Unix()
}

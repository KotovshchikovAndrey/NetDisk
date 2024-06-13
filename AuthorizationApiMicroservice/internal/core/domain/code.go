package domain

import "time"

type CodePurpose string

const (
	VerifySignUp   CodePurpose = "VERIFY_SIGN_UP"
	ChangePassword CodePurpose = "CHANGE_PASSWORD"
)

type Code struct {
	ID        string
	Value     string
	UserID    string
	CreatedAt time.Time
	ExpiredAt time.Time
	Purpose   CodePurpose
}

func (code *Code) IsExired() bool {
	return code.ExpiredAt.Before(time.Now().UTC())
}

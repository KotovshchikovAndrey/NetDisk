package domain

import "time"

type CodePurpose string

const (
	SignIn         CodePurpose = "SignIn"
	Verify         CodePurpose = "VERIFY"
	ChangePassword CodePurpose = "CHANGE_PASSWORD"
)

type Code struct {
	ID        string
	Value     uint
	UserID    string
	DeviceID  string
	CreatedAt time.Time
	ExpiredAt time.Time
	Purpose   CodePurpose
}

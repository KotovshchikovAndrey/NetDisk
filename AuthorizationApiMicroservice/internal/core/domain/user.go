package domain

import (
	core_config "authorization/internal/core/config"
	"fmt"
	"math/rand"
	"strings"
	"time"
)

type User struct {
	ID             string
	Name           string
	Email          string
	Secret         string
	IsVerified     bool
	CreatedAt      time.Time
	LastLoginAt    time.Time
	HashedPassword string
	Codes          []*Code
}

func (user *User) IssueVerificationCode() string {
	code := user.generateCode()
	user.Codes = append(user.Codes, &Code{
		Value:     code,
		CreatedAt: time.Now().UTC(),
		ExpiredAt: time.Now().Add(time.Second * core_config.CodeTtl).UTC(),
		Purpose:   VerifySignUp,
	})

	return code
}

func (user *User) CheckVerificationCode(codeString string) error {
	for index, code := range user.Codes {
		if (code.Value == codeString) && (code.Purpose == VerifySignUp) {
			if !code.IsExired() {
				return nil
			}

			// remove expired code
			user.Codes = append(user.Codes[:index], user.Codes[index+1:]...)
			return ErrCodeExpired
		}
	}

	return ErrInvalidCode
}

func (user *User) Is2faEnabled() bool {
	return true
}

func (user *User) generateCode() string {
	var codeBuilder strings.Builder
	first := rand.Intn(10)
	for first == 0 {
		first = rand.Intn(10)
	}

	codeBuilder.WriteString(fmt.Sprint(first))
	for index := 0; index < int(core_config.CodeLength)-1; index++ {
		codeBuilder.WriteString(fmt.Sprint(rand.Intn(10)))
	}

	return codeBuilder.String()
}

type CodePurpose string

const (
	VerifySignUp   CodePurpose = "VERIFY_SIGN_UP"
	ChangePassword CodePurpose = "CHANGE_PASSWORD"
)

type Code struct {
	Value     string
	CreatedAt time.Time
	ExpiredAt time.Time
	Purpose   CodePurpose
}

func (code *Code) IsExired() bool {
	return code.ExpiredAt.Before(time.Now().UTC())
}

// TODO: ...
// type Setting struct {
// 	ID               string
// 	Name             string
// 	IsMultipleChoice bool
// 	Options          []Option
// }

// type Option struct {
// 	ID             string
// 	Name           string
// 	DefaultEnabled bool
// }

// type UserOption struct {
// 	ID        string
// 	OptionID  string
// 	IsEnabled bool
// }

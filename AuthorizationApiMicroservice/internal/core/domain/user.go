package domain

import "time"

type User struct {
	ID             string
	Name           string
	Email          string
	Secret         string
	IsVerified     bool
	CreatedAt      time.Time
	LastLoginAt    time.Time
	HashedPassword string
	Options        []UserOption
}

type Setting struct {
	ID               string
	Name             string
	IsMultipleChoice bool
	Options          []Option
}

type Option struct {
	ID             string
	Name           string
	DefaultEnabled bool
}

type UserOption struct {
	ID        string
	OptionID  string
	IsEnabled bool
}

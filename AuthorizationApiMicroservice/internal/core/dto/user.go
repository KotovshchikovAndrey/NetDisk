package dto

type SignUpInput struct {
	Name     string
	Email    string
	Password string
	DeviceID string
}

type SignInInput struct {
	Email    string
	Password string
	DeviceID string
}

type RefreshTokenInput struct {
	DeviceID     string
	RefreshToken string
}

type VerifyInput struct {
	UserID   string
	DeviceID string
	Code     string
}

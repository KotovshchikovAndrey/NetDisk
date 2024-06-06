package dto

import "authorization/internal/core/domain"

type TokenPairOutput struct {
	Accesstoken  domain.Token
	Refreshtoken domain.Token
}

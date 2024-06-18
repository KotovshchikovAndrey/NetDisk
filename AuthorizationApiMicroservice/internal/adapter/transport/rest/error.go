package rest

import (
	"authorization/internal/core/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	INVALID_LOGIN_OR_PASSWORD_ERROR_CODE = "INVALID_LOGIN_OR_PASSWORD_ERROR"
	INTERNAL_SERVER_ERROR_CODE           = "INTERNAL_SERVER_ERROR"
	REQUEST_VALIDATION_ERROR_CODE        = "REQUEST_VALIDATION_ERROR"
)

func validationError(ctx *gin.Context, err error) {

}

func catchError(ctx *gin.Context, err error) {
	var errorResponse *ErrorResponse
	switch err {

	case domain.ErrInvalidLoginOrPassword:
		errorResponse = newErrorResponse(
			INVALID_LOGIN_OR_PASSWORD_ERROR_CODE,
			err.Error(),
			http.StatusUnauthorized,
		)

	default:
		errorResponse = newErrorResponse(
			INTERNAL_SERVER_ERROR_CODE,
			err.Error(),
			http.StatusInternalServerError,
		)
	}

	ctx.Error(errorResponse)
}

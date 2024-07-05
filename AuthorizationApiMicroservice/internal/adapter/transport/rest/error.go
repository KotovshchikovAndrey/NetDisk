package rest

import (
	"authorization/internal/core/domain"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

const (
	INVALID_LOGIN_OR_PASSWORD_ERROR_CODE = "ERR_INVALID_LOGIN_OR_PASSWORD"
	INTERNAL_SERVER_ERROR_CODE           = "ERR_INTERNAL_SERVER"
	REQUEST_VALIDATION_ERROR_CODE        = "ERR_REQUEST_VALIDATION"
	USER_UNVERIFIED_ERROR_CODE           = "ERR_USER_UNVERIFIED"
	MISSING_DEVICE_ID_ERROR_CODE         = "ERR_MISSING_DEVICE_ID"
	EMAIL_OCCUPIED_ERROR_CODE            = "ERR_EMAIL_OCCUPIED"
	USER_ALREADY_VERIFIED_ERROR_CODE     = "ERR_USER_ALREADY_VERIFIED"
	FORBIDDEN_ERROR_CODE                 = "ERR_FORBIDDEN"
	UNAUTHORIZED_ERROR_CODE              = "ERR_UNAUTHORIZED"
	TOKEN_EXPIRED_ERROR_CODE             = "ERR_TOKEN_EXPIRED"
	INVALID_TOKEN_ERROR_CODE             = "ERR_INVALID_TOKEN"
	CODE_EXPIRED_ERROR_CODE              = "ERR_CODE_EXPIRED"
	INVALID_CODE_ERROR_CODE              = "ERR_INVALID_CODE"
	SESSION_EXPIRED_ERROR_CODE           = "ERR_SESSION_EXPIRED"
)

func validationError(ctx *gin.Context, err error) {
	errMessages := make(map[string]string)
	if errors.As(err, &validator.ValidationErrors{}) {
		for _, err := range err.(validator.ValidationErrors) {
			errMessage := err.ActualTag()
			if err.Param() != "" {
				errMessage = fmt.Sprintf("%s=%s", errMessage, err.Param())
			}

			errMessages[strings.ToLower(err.Field())] = errMessage
		}
	}

	ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
		"code":   REQUEST_VALIDATION_ERROR_CODE,
		"detail": errMessages,
	})
}

func catchError(ctx *gin.Context, err error) {
	// log error
	ctx.Error(err)
	ctx.Abort()
}

func getErrorResponse(err error) *ErrorResponse {
	var errorResponse *ErrorResponse
	switch err {

	case domain.ErrSessionExpired:
		errorResponse = newErrorResponse(
			SESSION_EXPIRED_ERROR_CODE,
			err.Error(),
			http.StatusUnauthorized,
		)

	case domain.ErrCodeExpired:
		errorResponse = newErrorResponse(
			CODE_EXPIRED_ERROR_CODE,
			err.Error(),
			http.StatusForbidden,
		)

	case domain.ErrInvalidCode:
		errorResponse = newErrorResponse(
			INVALID_CODE_ERROR_CODE,
			err.Error(),
			http.StatusForbidden,
		)

	case domain.ErrTokenExpired:
		errorResponse = newErrorResponse(
			TOKEN_EXPIRED_ERROR_CODE,
			err.Error(),
			http.StatusUnauthorized,
		)

	case domain.ErrInvalidToken:
		errorResponse = newErrorResponse(
			INVALID_TOKEN_ERROR_CODE,
			err.Error(),
			http.StatusForbidden,
		)

	case domain.ErrUnauthorized:
		errorResponse = newErrorResponse(
			UNAUTHORIZED_ERROR_CODE,
			err.Error(),
			http.StatusUnauthorized,
		)

	case domain.ErrForbidden:
		errorResponse = newErrorResponse(
			FORBIDDEN_ERROR_CODE,
			err.Error(),
			http.StatusForbidden,
		)

	case domain.ErrUserAlreadyVerified:
		errorResponse = newErrorResponse(
			USER_ALREADY_VERIFIED_ERROR_CODE,
			err.Error(),
			http.StatusConflict,
		)

	case domain.ErrEmailOccupied:
		errorResponse = newErrorResponse(
			EMAIL_OCCUPIED_ERROR_CODE,
			err.Error(),
			http.StatusConflict,
		)

	case domain.ErrMissingDeviceId:
		errorResponse = newErrorResponse(
			MISSING_DEVICE_ID_ERROR_CODE,
			err.Error(),
			http.StatusBadRequest,
		)

	case domain.ErrInvalidLoginOrPassword:
		errorResponse = newErrorResponse(
			INVALID_LOGIN_OR_PASSWORD_ERROR_CODE,
			err.Error(),
			http.StatusUnauthorized,
		)

	case domain.ErrUserUnverified:
		errorResponse = newErrorResponse(
			USER_UNVERIFIED_ERROR_CODE,
			err.Error(),
			http.StatusForbidden,
		)

	default:
		errorResponse = newErrorResponse(
			INTERNAL_SERVER_ERROR_CODE,
			"",
			http.StatusInternalServerError,
		)
	}

	return errorResponse
}

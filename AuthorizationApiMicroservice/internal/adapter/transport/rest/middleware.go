package rest

import (
	"authorization/internal/core/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

func deviceIdRequiredMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		_, err := ctx.Cookie("device_id")
		if err != nil {
			catchError(ctx, domain.ErrMissingDeviceId)
			return
		}

		ctx.Next()
	}
}

func errorHandlerMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Next()
		lastError := ctx.Errors.Last()
		if lastError == nil {
			return
		}

		switch err := lastError.Err.(type) {

		case ErrorResponse:
			ctx.JSON(-1, err)

		default:
			internalServerError := newErrorResponse(INTERNAL_SERVER_ERROR_CODE, "", http.StatusInternalServerError)
			ctx.JSON(http.StatusInternalServerError, internalServerError)
		}
	}
}

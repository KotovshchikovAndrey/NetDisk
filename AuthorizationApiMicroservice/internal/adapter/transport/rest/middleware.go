package rest

import (
	"authorization/internal/core/domain"

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
		err := ctx.Errors.Last()
		if err == nil {
			return
		}

		response := getErrorResponse(err.Err)
		ctx.AbortWithStatusJSON(response.HttpStatusCode, response)
	}
}

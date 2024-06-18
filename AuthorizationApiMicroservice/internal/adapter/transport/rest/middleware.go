package rest

import (
	core_config "authorization/internal/core/config"
	"authorization/internal/core/port"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func sessionMiddleware(service port.SessionService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// TODO:
		// If err exists then...?
		ctx.Next()

		userId, ok := ctx.Value("userID").(string)
		if !ok {
			return
		}

		newSession, err := service.Create(ctx, userId)
		if err != nil {
			catchError(ctx, err)
			return
		}

		ctx.SetCookie("session_key", newSession.Key, core_config.SessionTtl, "", "", false, true)
	}
}

func deviceIdRequiredMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		_, err := ctx.Cookie("device_id")
		if err != nil {
			ctx.Error(errors.New("device id required"))
			return
		}

		ctx.Next()
	}
}

func errorHandlerMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Next()
		for _, err := range ctx.Errors {
			switch e := err.Err.(type) {

			case ErrorResponse:
				ctx.AbortWithStatusJSON(e.HttpStatusCode, e)

			default:
				internalServerError := newErrorResponse(
					INTERNAL_SERVER_ERROR_CODE,
					err.Error(),
					http.StatusInternalServerError,
				)

				ctx.AbortWithStatusJSON(http.StatusInternalServerError, internalServerError)
			}
		}
	}
}

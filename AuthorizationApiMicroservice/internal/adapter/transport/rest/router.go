package rest

import (
	"authorization/internal/core/port"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewRouter(authService port.AuthService, sessionService port.SessionService) (*gin.Engine, error) {
	router := gin.Default()
	router.Use(errorHandlerMiddleware())
	router.Use(deviceIdRequiredMiddleware())

	v1Router := router.Group("/api/v1")
	{
		authRouter := v1Router.Group("/auth")
		authTransport := NewAuthTransport(authService, sessionService)
		{
			authRouter.GET("/verify-sign-in", authTransport.VerifySignIn)
			authRouter.POST("/sign-up", authTransport.SignUp)
			authRouter.POST("/sign-in", authTransport.SignIn)
			authRouter.PUT("/refresh", authTransport.RefreshToken)
			authRouter.DELETE("/sign-out", authTransport.SignOut)
			authRouter.Match([]string{http.MethodGet, http.MethodPost}, "/verify-sign-up", authTransport.VerifySignUp)
		}
	}

	return router, nil
}

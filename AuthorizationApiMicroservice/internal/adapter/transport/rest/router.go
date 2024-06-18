package rest

import (
	"authorization/internal/core/port"

	"github.com/gin-gonic/gin"
)

func NewRouter(userService port.UserService, sessionService port.SessionService) (*gin.Engine, error) {
	router := gin.Default()
	router.Use(deviceIdRequiredMiddleware())

	v1Router := router.Group("/api/v1")
	{
		authRouter := v1Router.Group("/auth")
		authTransport := NewAuthTransport(userService, sessionService)
		{
			authRouter.POST("/sign-up", sessionMiddleware(sessionService), authTransport.SignUp)
			authRouter.POST("/sign-in", sessionMiddleware(sessionService), authTransport.SignIn)
			authRouter.GET("/verify-sign-up", authTransport.VerifySignUp)
			authRouter.GET("/verify-sign-in", authTransport.VerifySignIn)
		}
	}

	router.Use(errorHandlerMiddleware())
	return router, nil
}

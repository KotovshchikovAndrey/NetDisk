package rest

import (
	"authorization/internal/adapter/transport/rest/v1"
	"authorization/internal/core/port"

	"github.com/gin-gonic/gin"
)

func NewRouter(userService port.UserService) (*gin.Engine, error) {
	router := gin.Default()
	v1Router := router.Group("/api/v1")
	{
		authRouter := v1Router.Group("/auth")
		authTransport := rest.NewAuthTransport(userService)
		{
			authRouter.GET("/ping", authTransport.Ping)
			authRouter.POST("/sign-up", authTransport.SignUp)
		}
	}

	return router, nil
}

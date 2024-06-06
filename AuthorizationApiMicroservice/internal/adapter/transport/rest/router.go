package rest

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewRouter() (*gin.Engine, error) {
	router := gin.New()
	v1 := router.Group("/api/v1")
	{
		v1.GET("/ping", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{"message": "pong"})
		})
	}

	return router, nil
}

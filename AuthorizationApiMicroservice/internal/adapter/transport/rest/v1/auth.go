package rest

import (
	"authorization/internal/core/dto"
	"authorization/internal/core/port"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SignUpRequest struct {
	Name     string `json:"name" binding:"required,min=1,max=70"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=5"`
	DeviceID string `json:"device_id" binding:"required"`
}

type AuthTransport struct {
	service port.UserService
}

func NewAuthTransport(service port.UserService) *AuthTransport {
	return &AuthTransport{
		service: service,
	}
}

func (transport *AuthTransport) Ping(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func (transport *AuthTransport) SignUp(ctx *gin.Context) {
	request := &SignUpRequest{}
	if err := ctx.ShouldBindJSON(request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"ТЫ": "ОШИБКА ПРИРОДЫ!",
		})

		return
	}

	userId, err := transport.service.SignUp(ctx, dto.SignUpInput{
		Name:     request.Name,
		Email:    request.Email,
		Password: request.Password,
		DeviceID: request.DeviceID,
	})

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "User was succesfully registered!",
		"user_id": userId,
	})
}

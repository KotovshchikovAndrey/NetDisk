package rest

import (
	"authorization/internal/core/dto"
	"authorization/internal/core/port"

	"github.com/gin-gonic/gin"
)

type SignUpRequest struct {
	Name     string `json:"name" binding:"required,min=1,max=70"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=5"`
}

type SignInRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=5"`
}

type VerifyRequest struct {
	Code string `json:"code" binding:"required,min=6,max=6"`
}

type AuthTransport struct {
	userService    port.UserService
	sessionService port.SessionService
}

func NewAuthTransport(userService port.UserService, sessionService port.SessionService) *AuthTransport {
	return &AuthTransport{
		userService:    userService,
		sessionService: sessionService,
	}
}

func (transport *AuthTransport) SignUp(ctx *gin.Context) {
	request := &SignUpRequest{}
	if err := ctx.ShouldBindJSON(request); err != nil {
		validationError(ctx, err)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	output, err := transport.userService.SignUp(ctx, dto.SignUpInput{
		Name:     request.Name,
		Email:    request.Email,
		Password: request.Password,
		DeviceID: deviceId,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	handleSignUpResponse(ctx, output)
}

func (transport *AuthTransport) SignIn(ctx *gin.Context) {
	request := &SignInRequest{}
	if err := ctx.ShouldBindJSON(request); err != nil {
		validationError(ctx, err)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	output, err := transport.userService.SignIn(ctx, dto.SignInInput{
		Email:    request.Email,
		Password: request.Password,
		DeviceID: deviceId,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	handleSignInResponse(ctx, output)
}

func (transport *AuthTransport) VerifySignUp(ctx *gin.Context) {
	request := &VerifyRequest{}
	if err := ctx.ShouldBindJSON(request); err != nil {
		validationError(ctx, err)
		return
	}

	sessionKey, err := ctx.Cookie("session_key")
	if err != nil {
		catchError(ctx, err)
		return
	}

	session, err := transport.sessionService.Get(ctx, sessionKey)
	if err != nil {
		catchError(ctx, err)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	err = transport.userService.VerifySignUp(ctx, dto.VerifyInput{
		UserID:   session.UserID,
		DeviceID: deviceId,
		Code:     request.Code,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	if err := transport.sessionService.Delete(ctx, sessionKey); err != nil {
		catchError(ctx, err)
		return
	}

	handleVerifySignUpResponse(ctx)
}

func (transport *AuthTransport) VerifySignIn(ctx *gin.Context) {
	request := &VerifyRequest{}
	if err := ctx.ShouldBindJSON(request); err != nil {
		validationError(ctx, err)
		return
	}

	sessionKey, err := ctx.Cookie("session_key")
	if err != nil {
		catchError(ctx, err)
		return
	}

	session, err := transport.sessionService.Get(ctx, sessionKey)
	if err != nil {
		catchError(ctx, err)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	output, err := transport.userService.VerifySignIn(ctx, dto.VerifyInput{
		UserID:   session.UserID,
		DeviceID: deviceId,
		Code:     request.Code,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	if err := transport.sessionService.Delete(ctx, sessionKey); err != nil {
		catchError(ctx, err)
		return
	}

	handleVerifySignInResponse(ctx, output)
}

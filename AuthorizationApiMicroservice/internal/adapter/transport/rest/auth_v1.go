package rest

import (
	core_config "authorization/internal/core/config"
	"authorization/internal/core/domain"
	"authorization/internal/core/dto"
	"authorization/internal/core/port"
	"net/http"

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
	Code string `form:"code" binding:"required,min=6,max=6"`
}

type AuthTransport struct {
	authService    port.AuthService
	sessionService port.SessionService
}

func NewAuthTransport(authService port.AuthService, sessionService port.SessionService) *AuthTransport {
	return &AuthTransport{
		authService:    authService,
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

	output, err := transport.authService.SignUp(ctx, dto.SignUpInput{
		Name:     request.Name,
		Email:    request.Email,
		Password: request.Password,
		DeviceID: deviceId,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	if err := transport.setSessionCookie(ctx, output.UserID); err != nil {
		catchError(ctx, err)
		return
	}

	response := newResponse("User registered successfully", nil)
	ctx.JSON(http.StatusCreated, response)
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

	output, err := transport.authService.SignIn(ctx, dto.SignInInput{
		Email:    request.Email,
		Password: request.Password,
		DeviceID: deviceId,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	var response *Response
	if output.TokenPair != nil {
		ctx.SetCookie("refresh_token", output.TokenPair.Refreshtoken, core_config.RefreshTokenTtl, "", "", false, true)
		response = newResponse("Successful sign in", gin.H{"access_token": output.TokenPair.Accesstoken})
	} else {
		response = newResponse("Required two-factor authentication", nil)
	}

	if err := transport.setSessionCookie(ctx, output.UserID); err != nil {
		catchError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (transport *AuthTransport) VerifySignUp(ctx *gin.Context) {
	session, err := transport.getSessionCookie(ctx)
	if err != nil {
		catchError(ctx, err)
		return
	}

	if ctx.Request.Method == http.MethodPost {
		err := transport.authService.ResendVerificationCode(ctx, session.UserID)
		if err != nil {
			catchError(ctx, err)
		}

		response := newResponse("Verification code resent successfully", nil)
		ctx.JSON(http.StatusOK, response)
		return
	}

	request := &VerifyRequest{}
	if err := ctx.ShouldBindQuery(request); err != nil {
		validationError(ctx, err)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	err = transport.authService.VerifySignUp(ctx, dto.VerifyInput{
		UserID:   session.UserID,
		DeviceID: deviceId,
		Code:     request.Code,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	response := newResponse("User verified successfully", nil)
	ctx.JSON(http.StatusOK, response)
}

func (transport *AuthTransport) VerifySignIn(ctx *gin.Context) {
	request := &VerifyRequest{}
	if err := ctx.ShouldBindJSON(request); err != nil {
		validationError(ctx, err)
		return
	}

	session, err := transport.getSessionCookie(ctx)
	if err != nil {
		catchError(ctx, err)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	output, err := transport.authService.VerifySignIn(ctx, dto.VerifyInput{
		UserID:   session.UserID,
		DeviceID: deviceId,
		Code:     request.Code,
	})

	if err != nil {
		catchError(ctx, err)
		return
	}

	ctx.SetCookie("refresh_token", output.Refreshtoken, core_config.RefreshTokenTtl, "", "", false, true)
	response := newResponse("User signed in successfully", gin.H{"access_token": output.Accesstoken})
	ctx.JSON(http.StatusOK, response)
}

func (transport *AuthTransport) SignOut(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie("refresh_token")
	if err == nil {
		// remove cookie
		ctx.SetCookie("refresh_token", refreshToken, -1, "", "", false, true)
		go transport.authService.SignOut(ctx, refreshToken)
	}

	sessionKey, err := ctx.Cookie("session_key")
	if err == nil {
		// remove cookie
		ctx.SetCookie("session_key", sessionKey, -1, "", "", false, true)
		go transport.sessionService.Delete(ctx, sessionKey)
	}

	response := newResponse("User signet out successfully", nil)
	ctx.JSON(http.StatusOK, response)

}

func (transport *AuthTransport) RefreshToken(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		catchError(ctx, domain.ErrInvalidToken)
		return
	}

	deviceId, err := ctx.Cookie("device_id")
	if err != nil {
		catchError(ctx, err)
		return
	}

	output, err := transport.authService.RefreshToken(
		ctx, dto.RefreshTokenInput{
			DeviceID:     deviceId,
			RefreshToken: refreshToken,
		})

	if err != nil {
		catchError(ctx, err)
		return
	}

	ctx.SetCookie("refresh_token", output.Refreshtoken, core_config.RefreshTokenTtl, "", "", false, true)
	response := newResponse("Token refreshed successfully", gin.H{"access_token": output.Accesstoken})
	ctx.JSON(http.StatusOK, response)
}

func (transport *AuthTransport) getSessionCookie(ctx *gin.Context) (*domain.Session, error) {
	sessionKey, err := ctx.Cookie("session_key")
	if err != nil {
		return nil, err
	}

	session, err := transport.sessionService.Get(ctx, sessionKey)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func (transport *AuthTransport) setSessionCookie(ctx *gin.Context, userId string) error {
	newSession, err := transport.sessionService.Create(ctx, userId)
	if err != nil {
		return err
	}

	ctx.SetCookie("session_key", newSession.Key, core_config.SessionTtl, "", "", false, true)
	return nil
}

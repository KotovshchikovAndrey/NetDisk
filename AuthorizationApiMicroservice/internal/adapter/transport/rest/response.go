package rest

import (
	core_config "authorization/internal/core/config"
	"authorization/internal/core/dto"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SuccessResponse struct {
	Message string `json:"message"`
	Data    gin.H  `json:"data,omitempty"`
}

func newSuccessResponse(message string, data gin.H) *SuccessResponse {
	return &SuccessResponse{Message: message, Data: data}
}

type ErrorResponse struct {
	Code           string `json:"code"`
	Detail         string `json:"detail"`
	HttpStatusCode int    `json:"-"`
}

func (response ErrorResponse) Error() string {
	return fmt.Sprintf("code: %s, detail: %s", response.Code, response.Detail)
}

func newErrorResponse(code string, detail string, httpStatusCode int) *ErrorResponse {
	return &ErrorResponse{
		Code:           code,
		Detail:         detail,
		HttpStatusCode: httpStatusCode,
	}
}

func handleSignUpResponse(ctx *gin.Context, data *dto.SignUpOutput) {
	ctx.Set("userID", data.UserID)
	response := newSuccessResponse("User registered successfully", nil)
	ctx.JSON(http.StatusCreated, response)
}

func handleSignInResponse(ctx *gin.Context, data *dto.SignInOutput) {
	var response *SuccessResponse
	if data.TokenPair != nil {
		ctx.SetCookie("refresh_token", data.TokenPair.Refreshtoken, core_config.RefreshTokenTtl, "", "", false, true)
		response = newSuccessResponse(
			"Successful sign in",
			gin.H{"access_token": data.TokenPair.Accesstoken},
		)
	} else {
		response = newSuccessResponse("Required two-factor authentication", nil)
	}

	ctx.Set("userID", data.UserID)
	ctx.JSON(http.StatusOK, response)
}

func handleVerifySignUpResponse(ctx *gin.Context) {
	sessionKey, err := ctx.Cookie("session_key")
	if err == nil {
		// remove cookie
		ctx.SetCookie("session_key", sessionKey, -1, "", "", false, true)
	}

	response := newSuccessResponse("User verified successfully", nil)
	ctx.JSON(http.StatusOK, response)
}

func handleVerifySignInResponse(ctx *gin.Context, data *dto.TokenPairOutput) {
	sessionKey, err := ctx.Cookie("session_key")
	if err == nil {
		// remove cookie
		ctx.SetCookie("session_key", sessionKey, -1, "", "", false, true)
	}

	response := newSuccessResponse(
		"User signed in successfully",
		gin.H{"access_token": data.Accesstoken},
	)

	ctx.SetCookie("refresh_token", data.Refreshtoken, core_config.RefreshTokenTtl, "", "", false, true)
	ctx.JSON(http.StatusOK, response)
}

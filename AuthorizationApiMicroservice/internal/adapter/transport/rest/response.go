package rest

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Message string `json:"message"`
	Data    gin.H  `json:"data"`
}

func newResponse(message string, data gin.H) *Response {
	return &Response{Message: message, Data: data}
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

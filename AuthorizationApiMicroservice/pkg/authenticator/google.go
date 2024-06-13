package authenticator

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

	"golang.org/x/net/html"
)

const baseUrl = "https://www.authenticatorApi.com"

type QRCodeUrl string

type QRCodePayload struct {
	Secret  string
	AppName string
	UserId  string
}

func GenerateQRCodeForGoogleAuthenticator(payload QRCodePayload) (QRCodeUrl, error) {
	url := fmt.Sprintf("%s/pair.aspx?AppName=%s&AppInfo=%s&SecretCode=%s", baseUrl, payload.AppName, payload.UserId, payload.Secret)
	response, err := http.Get(url)
	if err != nil {
		return "", err
	}

	defer response.Body.Close()

	doc, err := html.Parse(response.Body)
	if err != nil {
		return "", err
	}

	QRImgTag := doc.FirstChild.LastChild.FirstChild.FirstChild
	for _, attr := range QRImgTag.Attr {
		if attr.Key == "src" {
			return QRCodeUrl(attr.Val), nil
		}
	}

	return "", nil
}

func ValidateCode(code string, secret string) (bool, error) {
	url := fmt.Sprintf("%s/Validate.aspx?Pin=%s&SecretCode=%s", baseUrl, code, secret)
	response, err := http.Get(url)
	if err != nil {
		return false, err
	}

	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		return false, err
	}

	isValid, err := strconv.ParseBool(string(data))
	if err != nil {
		return false, nil
	}

	return isValid, nil
}

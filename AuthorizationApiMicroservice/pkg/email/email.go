package email

import (
	"fmt"
	"net/smtp"
)

type Email struct {
	From         string
	FromPassword string
	To           string
	SmtpHost     string
	SmtpPort     uint
	Subject      string
	Body         string
}

func SendEmail(email Email) error {
	smtpAuth := smtp.PlainAuth("", email.From, email.FromPassword, email.SmtpHost)
	message := buildMessage(email.From, email.To, email.Subject, email.Body)
	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", email.SmtpHost, email.SmtpPort),
		smtpAuth,
		email.From,
		[]string{email.To},
		message,
	)

	return err
}

func buildMessage(from string, to string, subject string, body string) []byte {
	message := fmt.Sprintf("From: %s\r\n", from)
	message += fmt.Sprintf("To: %s\r\n", to)
	message += fmt.Sprintf("Subject: %s\r\n", subject)
	message += fmt.Sprintf("\r\n%s\r\n", body)

	return []byte(message)
}

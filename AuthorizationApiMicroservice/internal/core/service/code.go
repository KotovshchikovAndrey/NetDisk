package service

import (
	"authorization/internal/adapter/config"
	core_config "authorization/internal/core/config"
	"authorization/internal/core/domain"
	"authorization/internal/core/port"
	"authorization/pkg/email"
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

type CodeService struct {
	config     config.Config
	repository port.CodeRepository
}

func NewCodeService(config config.Config, repository port.CodeRepository) port.CodeService {
	return &CodeService{config: config, repository: repository}
}

func (service *CodeService) SendVerificationCode(ctx context.Context, user domain.User) error {
	code := domain.Code{
		ID:        uuid.NewString(),
		Value:     service.generateCode(6),
		UserID:    user.ID,
		CreatedAt: time.Now().UTC(),
		ExpiredAt: time.Now().Add(core_config.CodeTtl * time.Second).UTC(),
		Purpose:   domain.Verify,
	}

	err := service.repository.Save(ctx, code)
	if err != nil {
		return err
	}

	go func() {
		err := email.SendEmail(email.Email{
			From:         service.config.MailFrom,
			FromPassword: service.config.MailPassword,
			To:           user.Email,
			SmtpHost:     service.config.MailHost,
			SmtpPort:     service.config.MailPort,
			Subject:      "Верификация аккаунта на NetDisk",
			Body:         fmt.Sprintf("Код для верификации: %s", code.Value),
		})

		if err != nil {
			log.Fatal(err)
			// Send to the broker
		}
	}()

	return nil
}

func (service *CodeService) CheckVerificationCode(ctx context.Context, codeString string, user domain.User) (*domain.Code, error) {
	query := port.CodeQuery{UserID: &user.ID, Pursone: domain.Verify}
	code, err := service.repository.GetOne(ctx, query)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrInvalidCode
		}

		return nil, err
	}

	if codeString != code.Value {
		return nil, domain.ErrInvalidCode
	}

	return code, nil
}

func (service *CodeService) SendSignInCode(ctx context.Context, user domain.User, deviceId string) error {
	code := domain.Code{
		ID:        uuid.NewString(),
		Value:     service.generateCode(6),
		UserID:    user.ID,
		CreatedAt: time.Now().UTC(),
		ExpiredAt: time.Now().Add(core_config.CodeTtl * time.Second).UTC(),
		Purpose:   domain.SignIn,
	}

	err := service.repository.Save(ctx, code)
	if err != nil {
		return err
	}

	go func() {
		err := email.SendEmail(email.Email{
			From:         service.config.MailFrom,
			FromPassword: service.config.MailPassword,
			To:           user.Email,
			SmtpHost:     service.config.MailHost,
			SmtpPort:     service.config.MailPort,
			Subject:      "Вход в аккаунт на NetDisk",
			Body:         fmt.Sprintf("Код для входа в аккаунт: %s", code.Value),
		})

		if err != nil {
			log.Fatal(err)
			// Send to the broker
		}
	}()

	return nil
}

func (service *CodeService) CheckSignInCode(ctx context.Context, codeString string, user domain.User, deviceId string) (*domain.Code, error) {
	query := port.CodeQuery{
		UserID:   &user.ID,
		DeviceID: &deviceId,
		Pursone:  domain.SignIn,
	}

	code, err := service.repository.GetOne(ctx, query)
	if err != nil {
		if err == domain.ErrNotFound {
			return nil, domain.ErrInvalidCode
		}

		return nil, err
	}

	if codeString != code.Value {
		return nil, domain.ErrInvalidCode
	}

	return code, nil
}

func (service *CodeService) Revoke(ctx context.Context, code domain.Code) {
	err := service.repository.Remove(ctx, code)
	if err != nil {
		log.Fatal(err)
		// Send to the broker
	}
}

func (service *CodeService) generateCode(length uint) string {
	var code string
	for i := 0; i < int(length); i++ {
		number := rand.Intn(10)
		if number == 0 {
			number += 1
		}

		code += fmt.Sprint(number)
	}

	return code
}

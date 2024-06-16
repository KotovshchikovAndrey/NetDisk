package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerHost string
	ServerPort uint

	JwtPublicKey  string
	JwtPrivateKey string

	MailFrom     string
	MailPassword string
	MailHost     string
	MailPort     uint

	MongoUri string
}

func NewConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	config := Config{}
	config.ServerHost = "127.0.0.1"
	config.ServerPort = 5000

	config.JwtPublicKey = os.Getenv("JWT_PUBLIC_KEY")
	config.JwtPrivateKey = os.Getenv("JWT_PRIVATE_KEY")

	config.MailFrom = os.Getenv("MAIL_FROM")
	config.MailPassword = os.Getenv("MAIL_PASSWORD")
	config.MailHost = os.Getenv("MAIL_HOST")

	mailPort, err := strconv.ParseUint(os.Getenv("MAIL_PORT"), 10, 64)
	if err != nil {
		return nil, err
	}

	config.MailPort = uint(mailPort)

	config.MongoUri = os.Getenv("MONGO_URI")
	return &config, nil
}

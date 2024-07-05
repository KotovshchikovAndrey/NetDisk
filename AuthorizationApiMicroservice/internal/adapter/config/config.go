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

	MongoUri           string
	CleanTokenInterval int

	RedisAddr     string
	RedisPassword string
}

func NewConfig(envPath string) (*Config, error) {
	err := godotenv.Load(envPath)
	if err != nil {
		return nil, err
	}

	config := Config{}
	config.ServerHost = "127.0.0.1"
	config.ServerPort = 5000

	privateKeyPath := os.Getenv("JWT_PRIVATE_KEY_PATH")
	publicKeyPath := os.Getenv("JWT_PUBLIC_KEY_PATH")

	privateKey, err := os.ReadFile(privateKeyPath)
	if err != nil {
		return nil, err
	}

	publicKey, err := os.ReadFile(publicKeyPath)
	if err != nil {
		return nil, err
	}

	config.JwtPrivateKey = string(privateKey)
	config.JwtPublicKey = string(publicKey)

	config.MailFrom = os.Getenv("MAIL_FROM")
	config.MailPassword = os.Getenv("MAIL_PASSWORD")
	config.MailHost = os.Getenv("MAIL_HOST")

	mailPort, err := strconv.ParseUint(os.Getenv("MAIL_PORT"), 10, 64)
	if err != nil {
		return nil, err
	}

	config.MailPort = uint(mailPort)

	config.MongoUri = os.Getenv("MONGO_URI")
	config.CleanTokenInterval = 60 * 60 * 24 * 31 // 1 month

	config.RedisAddr = os.Getenv("REDIS_ADDR")
	config.RedisPassword = os.Getenv("REDIS_PASSWORD")

	return &config, nil
}

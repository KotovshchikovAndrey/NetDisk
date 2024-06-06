package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerHost    string
	ServerPort    uint
	JwtPublicKey  string
	JwtPrivateKey string
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

	return &config, nil
}

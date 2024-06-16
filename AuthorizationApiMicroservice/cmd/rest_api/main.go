package main

import (
	"authorization/internal/adapter/config"
	"authorization/internal/adapter/storage/mongo"
	"authorization/internal/adapter/transport/rest"
	"authorization/internal/core/service"
	"fmt"
	"log"
)

func main() {
	config, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	tokenRepository, err := mongo.NewTokenMongoRepository(config)
	if err != nil {
		log.Fatal(err)
	}

	userRepository, err := mongo.NewUserMongoRepository(config)
	if err != nil {
		log.Fatal(err)
	}

	tokenService := service.NewTokenService(tokenRepository)
	userService := service.NewUserService(config, userRepository, tokenService)

	router, err := rest.NewRouter(userService)
	if err != nil {
		log.Fatal(err)
	}

	router.Run(fmt.Sprintf("%s:%d", config.ServerHost, config.ServerPort))
}

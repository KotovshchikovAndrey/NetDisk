package main

import (
	"authorization/internal/adapter/config"
	"authorization/internal/adapter/storage/mongo"
	"authorization/internal/adapter/transport/rest"
	"authorization/internal/core/service"
	"context"
	"fmt"
	"log"
)

func main() {
	config, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	client, err := mongo.NewMongoConnection(config)
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	tokenRepository := mongo.NewTokenMongoRepository(client)
	userRepository := mongo.NewUserMongoRepository(client)

	tokenService := service.NewTokenService(tokenRepository)
	userService := service.NewUserService(config, userRepository, tokenService)
	sessionService := service.NewSessionService(nil)

	router, err := rest.NewRouter(userService, sessionService)
	if err != nil {
		log.Fatal(err)
	}

	router.Run(fmt.Sprintf("%s:%d", config.ServerHost, config.ServerPort))
}

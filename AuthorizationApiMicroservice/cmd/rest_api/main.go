package main

import (
	"authorization/internal/adapter/config"
	"authorization/internal/adapter/storage/mongo"
	"authorization/internal/adapter/storage/redis"
	"authorization/internal/adapter/transport/rest"
	"authorization/internal/core/service"
	"context"
	"flag"
	"fmt"
	"log"
)

func main() {
	envFile := flag.String("env-file", ".env", "Path to the .env file")
	flag.Parse()

	config, err := config.NewConfig(*envFile)
	if err != nil {
		log.Fatal(err)
	}

	mongoClient, err := mongo.NewMongoConnection(config)
	if err != nil {
		log.Fatal(err)
	}

	redisClient := redis.NewRedisClient(config)
	defer func() {
		if err := mongoClient.Disconnect(context.TODO()); err != nil {
			panic(err)
		}

		if err := redisClient.Close(); err != nil {
			panic(err)
		}
	}()

	tokenRepository := mongo.NewTokenMongoRepository(mongoClient)
	userRepository := mongo.NewUserMongoRepository(mongoClient)
	sessionStorage := redis.NewSessionRedisRepository(redisClient)

	tokenService := service.NewTokenService(config, tokenRepository)
	authService := service.NewAuthService(config, userRepository, tokenService)
	sessionService := service.NewSessionService(sessionStorage)

	router, err := rest.NewRouter(authService, sessionService)
	if err != nil {
		log.Fatal(err)
	}

	router.Run(fmt.Sprintf("%s:%d", config.ServerHost, config.ServerPort))
}

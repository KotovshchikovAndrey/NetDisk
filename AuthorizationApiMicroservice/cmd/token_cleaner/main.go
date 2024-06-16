package main

import (
	"authorization/internal/adapter/config"
	"authorization/internal/adapter/storage/mongo"
	"authorization/internal/core/port"
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"
)

func cleanExpiredTokens(repository port.TokenRepository) {
	if err := repository.RemoveExpired(context.TODO()); err != nil {
		panic(err)
	}

	fmt.Print("Clean!\n")
}

func main() {
	config, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	client, err := mongo.NewMongoConnection(config)
	if err != nil {
		log.Fatal(err)
	}

	repository := mongo.NewTokenMongoRepository(client)

	isExit := make(chan os.Signal, 1)
	signal.Notify(isExit)

	isStoped := make(chan bool)
	ticker := time.NewTicker(time.Second * time.Duration(config.CleanTokenInterval))

	fmt.Print("Token Cleaner is running!\n")
	cleanExpiredTokens(repository)

	go func() {
		defer func() { isStoped <- true }()

		for {
			select {
			case <-isStoped:
				fmt.Print("Stop proccess...\n")
				return

			case <-ticker.C:
				cleanExpiredTokens(repository)
			}
		}

	}()

	<-isExit
	ticker.Stop()

	isStoped <- true

	<-isStoped
	fmt.Print("Token Cleaner is stoped!\n")
}

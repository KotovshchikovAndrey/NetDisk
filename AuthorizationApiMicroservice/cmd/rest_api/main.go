package main

import (
	"authorization/internal/adapter/config"
	"authorization/internal/adapter/transport/rest"
	"fmt"
	"log"
)

func main() {
	config, err := config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	router, err := rest.NewRouter()
	if err != nil {
		log.Fatal(err)
	}

	router.Run(fmt.Sprintf("%s:%d", config.ServerHost, config.ServerPort))
}

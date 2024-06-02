package db

import (
	"context"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client

var mongoHosts = os.Getenv("MONGO_HOSTS")
var mongoPort = os.Getenv("MONGO_PORT")
var mongoUser = os.Getenv("MONGO_USER")
var mongoPassword = os.Getenv("MONGO_PASSWORD")
var mongoDb = os.Getenv("MONGO_DB")

func GetDbCtx() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	return ctx, cancel
}

func GetMongoDbName() string {
	if len(mongoDb) > 0 {
		return mongoDb
	}
	return "acc487"
}

func GetMongoClient() (*mongo.Client, error) {
	if mongoClient != nil {
		return mongoClient, nil
	}

	mongoUri := url.URL{
		Scheme: "mongodb",
		Host:   "localhost:27017",
		User:   nil,
	}

	if len(mongoHosts) > 0 {
		mongoUri.Host = mongoHosts
	}

	if len(mongoPort) > 0 {
		parts := strings.Split(mongoUri.Host, ",")
		for idx := range parts {
			parts[idx] += ":" + mongoPort
		}
		mongoUri.Host = strings.Join(parts, ",")
	}

	log.Printf("Connecting to MongoDB: %s", mongoUri.String())

	if len(mongoUser) > 0 || len(mongoPassword) > 0 {
		mongoUri.User = url.UserPassword(mongoUser, mongoPassword)
	}

	dbCtx, _ := GetDbCtx()
	var err error
	mongoClient, err = mongo.Connect(
		dbCtx,
		options.Client().ApplyURI(mongoUri.String()),
	)

	if err != nil {
		return nil, err
	}

	return mongoClient, nil
}

func CloseMongoClient() error {
	if mongoClient == nil {
		return nil
	}
	dbCtx, _ := GetDbCtx()
	return mongoClient.Disconnect(dbCtx)
}

package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/andre487/acc487/db"
)

func GetHome(c *gin.Context) {
	user := c.MustGet(gin.AuthUserKey).(string)

	mongoClient, err := db.GetMongoClient()
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
		return
	}

	settings, done := getSettings(c, mongoClient, user)
	if done {
		return
	}

	c.HTML(http.StatusOK, "base", gin.H{
		"main": "index",
		"user": user,
		"config": map[string]any{
			"apiBaseUrl":   "http://127.0.0.1:8080",
			"user":         user,
			"userSettings": settings,
		},
	})
}

func getSettings(c *gin.Context, mongoClient *mongo.Client, user string) (interface{}, bool) {
	dbClient := mongoClient.Database(db.GetMongoDbName())
	dbCtx, dbCancel := db.GetDbCtx()
	defer dbCancel()

	var err error
	var settings interface{}
	settingsDbRes := dbClient.Collection("settings").FindOne(dbCtx, bson.M{"user": user})
	err = settingsDbRes.Decode(&settings)
	if err != nil && !errors.Is(err, mongo.ErrNoDocuments) {
		c.String(http.StatusInternalServerError, err.Error())
		return nil, true
	} else if errors.Is(err, mongo.ErrNoDocuments) {
		settings = map[string]string{
			"foo": "bar",
		}
	}
	return settings, false
}

package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/andre487/acc487/db"
)

const MongoCollection = "accounts"

type MoneyValue struct {
	Amount   float64 `json:"amount" binding:"required"`
	Currency string  `json:"currency" binding:"required"`
}

type AccountDataRecord struct {
	Id    int        `json:"id" binding:"required"`
	Name  string     `json:"name" binding:"required"`
	Value MoneyValue `json:"value" binding:"required"`
}

type AccountData struct {
	Id      int                 `json:"id" binding:"required"`
	Name    string              `json:"name" binding:"required"`
	Records []AccountDataRecord `json:"records" binding:"required"`
}

type AccountsData struct {
	Accounts []AccountData `json:"accounts" binding:"required"`
}

func GetData(c *gin.Context) {
	user := c.MustGet(gin.AuthUserKey)

	mongoClient, err := db.GetMongoClient()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	mongoCollection := mongoClient.Database(db.GetMongoDbName()).Collection(MongoCollection)
	filter := bson.M{"user": user}

	dbCtx, cancelDbReqs := db.GetDbCtx()
	defer cancelDbReqs()

	result := mongoCollection.FindOne(dbCtx, filter)

	var data AccountsData
	docErr := result.Decode(&data)
	if docErr != nil && !errors.Is(docErr, mongo.ErrNoDocuments) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": docErr.Error()})
		return
	} else if errors.Is(docErr, mongo.ErrNoDocuments) {
		for accId := 0; accId < 3; accId++ {
			accountData := AccountData{
				Id:      accId,
				Name:    "Account " + strconv.Itoa(accId),
				Records: []AccountDataRecord{},
			}

			for recId := 0; recId < 5; recId++ {
				accountData.Records = append(accountData.Records, AccountDataRecord{
					Id:    recId,
					Name:  "Record " + strconv.Itoa(recId),
					Value: MoneyValue{Amount: 0, Currency: "RUB"},
				})
			}

			data.Accounts = append(data.Accounts, accountData)
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK", "data": data})
}

func SetData(c *gin.Context) {
	user := c.MustGet(gin.AuthUserKey)

	var data AccountsData
	if err := c.BindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mongoClient, err := db.GetMongoClient()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	mongoCollection := mongoClient.Database(db.GetMongoDbName()).Collection(MongoCollection)
	filter := bson.M{"user": user}
	update := bson.D{{"$set", data}}

	dbCtx, cancelDbReqs := db.GetDbCtx()
	defer cancelDbReqs()

	result, err := mongoCollection.UpdateOne(
		dbCtx,
		filter,
		update,
		options.Update().SetUpsert(true),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if result.MatchedCount == 0 && result.UpsertedCount == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no matched records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}

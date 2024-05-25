package main

import (
	"errors"
	"html/template"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/andre487/acc487/db"
	"github.com/andre487/acc487/utils"
)

const AssetsDir = "../assets"

func main() {
	r := setupRouter()
	err := r.Run("127.0.0.1:8080")
	if err != nil {
		log.Fatalf("Service launch error: %s", err)
	}
}

func setupRouter() *gin.Engine {
	t := utils.Must(loadTemplates())

	r := gin.New()
	r.SetHTMLTemplate(t)
	r.StaticFS("/assets", http.Dir(AssetsDir))

	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo": "bar", // user:foo password:bar
	}))

	authorized.GET("", func(c *gin.Context) {
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
				"userSettings": settings,
			},
		})
	})

	authorized.GET("test-data", func(c *gin.Context) {
		var data = map[string]string{
			"foo":  "bar",
			"baz":  "qux",
			"quux": "tri",
		}
		c.JSON(http.StatusOK, gin.H{"data": data})
	})

	authorized.POST("admin", func(c *gin.Context) {
		//user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
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

func loadTemplates() (*template.Template, error) {
	t := template.New("").Funcs(template.FuncMap{
		"ViteAsset":  utils.CreateAssetGetter(AssetsDir + "/.vite/manifest.json"),
		"JsonEncode": utils.JsonEncode,
	})

	for name, file := range AssetsTemplates.Files {
		if file.IsDir() || !strings.HasSuffix(name, ".tmpl") {
			continue
		}
		h, err := io.ReadAll(file)
		if err != nil {
			return nil, err
		}
		t, err = t.New(name).Parse(string(h))
		if err != nil {
			return nil, err
		}
	}
	return t, nil
}

package main

import (
	"html/template"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/andre487/acc487/utils"
)

const AssetsDir = "../assets"

var db = make(map[string]string)

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

		c.HTML(http.StatusOK, "base", gin.H{
			"user": user,
			"main": "index",
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

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}

func loadTemplates() (*template.Template, error) {
	t := template.New("").Funcs(template.FuncMap{
		"ViteAsset": utils.CreateAssetGetter(AssetsDir + "/.vite/manifest.json"),
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

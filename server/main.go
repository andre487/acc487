package main

import (
	"html/template"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/andre487/acc487/handlers"
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
	tpl := utils.Must(loadTemplates())

	router := gin.New()
	router.SetHTMLTemplate(tpl)
	router.StaticFS("/assets", http.Dir(AssetsDir))

	router.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	authorized := router.Group("/", gin.BasicAuth(gin.Accounts{
		"foo": "bar", // user:foo password:bar
	}))

	authorized.GET("", handlers.GetHome)
	authorized.POST("api/accounts/get-data", handlers.GetData)
	authorized.POST("api/accounts/set-data", handlers.SetData)

	return router
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

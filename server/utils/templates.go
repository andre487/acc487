package utils

import (
	"encoding/json"
	"io"

	"github.com/jessevdk/go-assets"
)

type TmplAssetData struct {
	Js  string
	Css []string
}

var dataCache = make(map[string]TmplAssetData)

func CreateAssetGetter(assets *assets.FileSystem) func(name string) TmplAssetData {
	viteManifest := Must(assets.Open("/.vite/manifest.json"))
	defer WarnIfError(viteManifest.Close())

	manifestContent := Must(io.ReadAll(viteManifest))
	var manifestData map[string]interface{}
	Must0(json.Unmarshal(manifestContent, &manifestData))

	return func(name string) TmplAssetData {
		if res, ok := dataCache[name]; ok {
			return res
		}

		rawNode, ok := manifestData[name]
		if !ok {
			return TmplAssetData{}
		}

		res := TmplAssetData{}
		node := rawNode.(map[string]interface{})
		if val, ok := node["file"]; ok {
			res.Js = "/assets/" + val.(string)
		}

		if val, ok := node["css"]; ok {
			for _, cssName := range val.([]interface{}) {
				res.Css = append(res.Css, "/assets/"+cssName.(string))
			}
		}

		dataCache[name] = res
		return res
	}
}

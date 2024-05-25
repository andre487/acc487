package utils

import (
	"encoding/json"
	"io"
	"os"
)

type TmplAssetData struct {
	Js  string
	Css []string
}

var dataCache = make(map[string]TmplAssetData)
var useCache = os.Getenv("USE_ASSET_CACHE") == "1"

func CreateAssetGetter(assetManifest string) func(name string) TmplAssetData {
	return func(name string) TmplAssetData {
		if useCache {
			if res, ok := dataCache[name]; ok {
				return res
			}
		}

		viteManifest := Must(os.Open(assetManifest))
		defer func(viteManifest *os.File) {
			WarnIfError(viteManifest.Close())
		}(viteManifest)

		manifestContent := Must(io.ReadAll(viteManifest))
		var manifestData map[string]interface{}
		Must0(json.Unmarshal(manifestContent, &manifestData))

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

		if useCache {
			dataCache[name] = res
		}
		return res
	}
}

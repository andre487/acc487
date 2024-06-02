package main

import (
	"time"

	"github.com/jessevdk/go-assets"
)

var _AssetsTemplatesc44be978e176338041954252c4188bfc0e6479eb = "{{ template \"index\" }}\n\n{{ define \"head\" }}\n    {{ $assetData := ViteAsset \"index.html\" }}\n    {{ range $val := $assetData.Css }}\n        <link rel=\"stylesheet\" href=\"{{ $val }}\">\n    {{ end }}\n{{ end }}\n\n{{ define \"main\" }}\n    {{ $assetData := ViteAsset \"index.html\" }}\n    <div id=\"root\"></div>\n    <script>\n        window.config = {{ .config | JsonEncode }};\n    </script>\n    {{ if $assetData.Js }}\n        <script type=\"module\" src=\"{{ $assetData.Js }}\"></script>\n    {{ end }}\n{{ end }}\n"
var _AssetsTemplatesa4103959677b78f4ee01e99796befc67e84087e6 = "{{ define \"base\" }}\n    <!DOCTYPE html>\n    <meta charset=\"utf8\">\n\n    <title>{{ .Title }}</title>\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/assets/vite.svg\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    {{ template \"head\" .}}\n\n    <main class=\"content\">{{ template \"main\" . }}</main>\n{{ end }}\n"

// AssetsTemplates returns go-assets FileSystem
var AssetsTemplates = assets.NewFileSystem(map[string][]string{"/": []string{"index.tmpl", "base.tmpl"}}, map[string]*assets.File{
	"/": &assets.File{
		Path:     "/",
		FileMode: 0x800001ed,
		Mtime:    time.Unix(1716666624, 1716666624828903641),
		Data:     nil,
	}, "/index.tmpl": &assets.File{
		Path:     "/index.tmpl",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1716666083, 1716666083618041175),
		Data:     []byte(_AssetsTemplatesc44be978e176338041954252c4188bfc0e6479eb),
	}, "/base.tmpl": &assets.File{
		Path:     "/base.tmpl",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1716660666, 1716660666715451119),
		Data:     []byte(_AssetsTemplatesa4103959677b78f4ee01e99796befc67e84087e6),
	}}, "")

package main

import (
	"time"

	"github.com/jessevdk/go-assets"
)

var _AssetsTemplatesc44be978e176338041954252c4188bfc0e6479eb = "{{ template \"index\" }}\n\n{{ define \"main\" }}\n    <p>Main page</p>\n{{ end }}\n"
var _AssetsTemplatesa4103959677b78f4ee01e99796befc67e84087e6 = "{{ define \"base\" }}\n<!DOCTYPE html>\n<meta charset=\"utf8\" />\n<title>{{ .Title }}</title>\n<link rel=\"stylesheet\" href=\"/assets/base.css\">\n<h1>Hello, {{ .user }}!</h1>\n<main class=\"content\">{{ template \"main\" . }}</main>\n{{ end }}\n"

// AssetsTemplates returns go-assets FileSystem
var AssetsTemplates = assets.NewFileSystem(map[string][]string{"/": []string{"index.tmpl", "base.tmpl"}}, map[string]*assets.File{
	"/": &assets.File{
		Path:     "/",
		FileMode: 0x800001ed,
		Mtime:    time.Unix(1716113982, 1716113982348355361),
		Data:     nil,
	}, "/index.tmpl": &assets.File{
		Path:     "/index.tmpl",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1716114007, 1716114007051995949),
		Data:     []byte(_AssetsTemplatesc44be978e176338041954252c4188bfc0e6479eb),
	}, "/base.tmpl": &assets.File{
		Path:     "/base.tmpl",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1716120386, 1716120386719045866),
		Data:     []byte(_AssetsTemplatesa4103959677b78f4ee01e99796befc67e84087e6),
	}}, "")

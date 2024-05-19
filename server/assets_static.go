package main

import (
	"time"

	"github.com/jessevdk/go-assets"
)

var _AssetsStaticc3607829b452df8ac82f07328780cb47396e3ac8 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<module type=\"WEB_MODULE\" version=\"4\">\n  <component name=\"NewModuleRootManager\" inherit-compiler-output=\"true\">\n    <exclude-output />\n    <content url=\"file://$MODULE_DIR$\" />\n    <orderEntry type=\"inheritedJdk\" />\n    <orderEntry type=\"sourceFolder\" forTests=\"false\" />\n  </component>\n</module>"
var _AssetsStatic74212f5c6e3f319e39db7662397c367097a11c14 = ":root {\n    font-family: sans-serif;\n}\n\nbody {\n    margin: 0;\n}\n"

// AssetsStatic returns go-assets FileSystem
var AssetsStatic = assets.NewFileSystem(map[string][]string{"/": []string{"assets.iml", "base.css"}}, map[string]*assets.File{
	"/assets.iml": &assets.File{
		Path:     "/assets.iml",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1716121650, 1716121650522557356),
		Data:     []byte(_AssetsStaticc3607829b452df8ac82f07328780cb47396e3ac8),
	}, "/base.css": &assets.File{
		Path:     "/base.css",
		FileMode: 0x1a4,
		Mtime:    time.Unix(1716121270, 1716121270121915437),
		Data:     []byte(_AssetsStatic74212f5c6e3f319e39db7662397c367097a11c14),
	}, "/": &assets.File{
		Path:     "/",
		FileMode: 0x800001ed,
		Mtime:    time.Unix(1716121650, 1716121650520238429),
		Data:     nil,
	}}, "")

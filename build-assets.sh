#!/usr/bin/env bash
set -eufo pipefail

if ! which go-assets-builder &>/dev/null; then
    go install github.com/jessevdk/go-assets-builder@latest
fi

go-assets-builder server/templates -o server/assets_templates.go -v AssetsTemplates --strip-prefix=/server/templates
go-assets-builder assets -o server/assets_static.go -v AssetsStatic --strip-prefix=/assets

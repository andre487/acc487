#!/usr/bin/env bash
set -eufo pipefail
cd "$(dirname "$0")"

./build-assets.sh

if [[ $* =~ --run ]]; then
    if ! which modd &>/dev/null; then
        go install github.com/cortesi/modd/cmd/modd@latest
    fi
    modd
else
    go build server
fi

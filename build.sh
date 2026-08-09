#!/usr/bin/env bash
set -euo pipefail

DATA_REPO="https://github.com/1574242600/blog-data.git"

get_data() {
    rm -rf /tmp/blog-data
    git clone --depth 1 "$DATA_REPO" /tmp/blog-data

    rm -rf ./src/content
    rm -rf ./src/data
    cp -R /tmp/blog-data/content ./src/content
    cp -R /tmp/blog-data/data ./src/data

    rm -rf /tmp/blog-data/
}

main() {
    get_data

    pnpm run build
}

main

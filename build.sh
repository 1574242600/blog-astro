get_data() {
    git clone https://github.com/1574242600/blog-data.git /tmp/blog-data

    cp -R /tmp/blog-data/content ./src
    cp -R /tmp/blog-data/data ./src
    cp -R /tmp/blog-data/script .

    rm -rf /tmp/blog-data/
}

handleMd() {
    for filepath in ./src/content/posts/*; do
        bash ./script/copyImageToLocal.sh "$filepath"
    done
}

main() {
    get_data
    handleMd

    pnpm install https://github.com/1574242600/astro-rehype-excerpt
    pnpm run build
}

main
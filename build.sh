get_data() {
    git clone https://github.com/1574242600/blog-data.git /tmp/blog-data
    cp -R /tmp/blog-data/* ./src
    rm -rf /tmp/blog-data/
}

main() {
    get_data
    pnpm run build
}

main
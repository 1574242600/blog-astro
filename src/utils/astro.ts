import fs from 'fs/promises'

export function genPagePaths(path: string, pageCount: number) {
    return Array(pageCount)
        .fill(0)
        .map((_, i) => `${path}${i + 1}`)
}

export function readFontsFile(name: string) {
    return fs.readFile(`./src/fonts/${name}`)
}
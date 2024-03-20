import getReadingTime from 'reading-time'
import fetch from 'node-fetch'
import * as path from 'path'
import * as fs from 'fs'
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'

export function remarkReadingTime() {
    return function (tree, { data }) {
        const textOnPage = toString(tree)
        const readingTime = getReadingTime(textOnPage)
        data.astro.frontmatter.minutesRead = readingTime.minutes.toFixed(1)
    }
}

export function copyImageToLocal({ domains, toPath, mdPath }) {
    function isRemoteAndAuthorized(str, domains) {
        try {
            const url = new URL(str)

            return (['http:', 'https:']).includes(url.protocol)
                && domains.includes(url.hostname)
        } catch {
            return false
        }
    }

    function checkFileExists(filePath) {
        try {
            fs.accessSync(filePath, fs.constants.F_OK)
            return true
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false
            } else {
                throw err
            }
        }
    }

    function getImageNode(tree) {
        const nodes = []

        visit(tree, ['image'], (node) => {
            if (!isRemoteAndAuthorized(node.url, domains)) return
            nodes.push(node)
        })

        return nodes
    }

    function fetchImage(url) {
        return fetch(url)
            .then(r => {
                if (r.status !== 200) {
                    throw new Error(`fetchImage Error: ${r.status}`)
                } 

                return r
            })
            .then(r => r.arrayBuffer())
            .then(ab => Buffer.from(ab))
    }

    function toFileName(url) {
        //如果图片 url 不带后缀会出问题
        return url.pathname
            .slice(1)
            .replaceAll(/\//g, '$')
    }

    function writeFile(filePath, buf) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
        fs.writeFileSync(filePath, buf)
    }

    return async function (tree) {
        const nodes = getImageNode(tree)

        for (const node of nodes) {
            const url = new URL(node.url)
            const fileName = toFileName(url)
            const filePath = path.join(toPath, fileName)
            const _mdPath = path.join(mdPath, fileName)

            if (!checkFileExists(filePath)) {
                try {
                    const buf = await fetchImage(url)
                    writeFile(filePath, buf)
                    node.url = _mdPath
                } catch {
                    //todo
                    return
                }
            } else {
                node.url = _mdPath
            }
        }
    }
}
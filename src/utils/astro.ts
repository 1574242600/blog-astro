import fs from 'fs/promises'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import type { MarkdownInstance } from 'astro'

export async function getPosts(filter?: (entry: CollectionEntry<'posts'>) => boolean) {
    return (await getCollection('posts', filter))
        .sort((a ,b) => Number(b.data.date) -  Number(a.data.date))
        .filter(post => post.slug !== 'about')
}

export function genPagePaths(path: string, pageCount: number) {
    return Array(pageCount)
        .fill(0)
        .map((_, i) => `${path}${i + 1}`)
}

export async function getTags() {
    const allBlogPosts = await getPosts()

    return allBlogPosts.reduce<Record<string, number>>((pre, cur) => {

        cur.data.tags?.forEach(tag => {
            tag = tag.toLowerCase()
            return pre[tag] ? pre[tag]++ : pre[tag] = 1 
        })
        return pre
    }, {})
}

export function initRemarkPluginFrontmatter(obj: object): PostsRemarkPluginFrontmatter {

    const defaultRemarkPluginFrontmatter = {
        author: 'null',
        title: 'null',
        date: 'null',
        minutesRead: -1,
        excerpt: {
            html: 'null',
            text: 'null'
        }
    }

    return Object.assign({}, defaultRemarkPluginFrontmatter, obj)
}

export function readFontsFile(name: string) {
    return fs.readFile(`./src/fonts/${name}`)
}

export function createPostExcerptService(posts: MarkdownInstance<Record<string, unknown>>[], excerpt: string) {
    return (id: string) => {
        const post = posts.find(p => p.file.endsWith(id))
        if (!post) throw new Error(`PostExcerptService: 未找到 ${id}`)
        const fullHtml = post.compiledContent()
        const excerptHtml = fullHtml.split(excerpt)[0] ?? fullHtml
        const excerptText = excerptHtml
            .replace(/<(\S*?)[^>]*>.*?|<.*? \/>/g, ' ')
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
            .trim()

        return {
            html: excerptHtml,
            text: excerptText
        }
    }
}

export interface PostsRemarkPluginFrontmatter {
    author: string
    title: string
    date: string
    update?: string
    tags?: string[]
    minutesRead: number
    excerpt: {
        html: string,
        text: string
    }
}
import type { MarkdownInstance } from 'astro'
import { getCollection } from 'astro:content'
import type { InferEntrySchema } from 'astro:content'

class PostService {
    private posts: PostInstance[] = []

    public constructor(posts: PostInstance[]) {
        this.posts = posts
    }

    public static async init() {
        const posts = await PostServiceUtils.globPost()
        const newPosts = await Promise.all(posts.map((post) => PostService.handlePostInstance(post)))

        return new PostService(newPosts)
    }

    public getPosts(filter?: (entry: PostInstance) => boolean) {
        let posts = this.posts
        if (filter) posts = this.posts.filter(filter)

        return posts
            .sort((a ,b) => Number(b.frontmatter.date) -  Number(a.frontmatter.date))
            .filter(post => post.frontmatter.slug !== 'about')
    }

    public getPost(idOrSlug: string) {
        const post = this.posts.find(
            (post) => post.frontmatter.slug === idOrSlug
                    || post.file.endsWith(`/${idOrSlug}`)
        )

        if (!post) throw Error(`PostService: 未找到 ${idOrSlug} [getPost]`)
        return post
    }

    public getTags() {
        const allBlogPosts = this.getPosts()

        return allBlogPosts.reduce<Record<string, number>>((pre, cur) => {

            cur.frontmatter.tags?.forEach(tag => {
                tag = tag.toLowerCase()
                return pre[tag] ? pre[tag]++ : pre[tag] = 1 
            })
            return pre
        }, {})
    }

    private static async handlePostInstance(post: UnhandledPostInstance) {
        async function handlePostFrontmatter(post: UnhandledPostInstance) {
            const getSlug = await PostServiceUtils.createSlugGetter()
            const newPost = <PostInstance><unknown>Object.assign({}, post)

            newPost.frontmatter.slug = getSlug(post.file)
            newPost.frontmatter.excerpt = await PostServiceUtils.genPostExcerpt(post)
            newPost.frontmatter.date = new Date(post.frontmatter.date)

            return newPost
        }
    
        // eslint-disable-next-line prefer-const
        let newPost = await handlePostFrontmatter(post)

        return newPost
    }
}

class PostServiceUtils {

    public static async globPost(): Promise<PostInstance[]> {
        const list = import.meta.glob<PostInstance>('../content/posts/*.md')
        const allEntries = [...Object.values(list)]
        return Promise.all(allEntries.map((fn) => fn()))
    }

    public static async createSlugGetter() {
        const cPosts = await getCollection('posts')

        return (filePath: string) => {
            const post = cPosts.find((cPost) => filePath.endsWith(`/${cPost.id}`))
            if (!post) throw new Error(`PostService: 未找到 ${filePath} [createSlugGetter]`)
            return post.slug
        }
    }
            
    public static async genPostExcerpt(post: UnhandledPostInstance) {
        const fullHtml = await post.compiledContent()
        const excerptHtml = fullHtml.split('<!--more-->')[0] ?? fullHtml
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

type UnhandledPostInstance = MarkdownInstance<InferEntrySchema<'posts'>>
type PostInstance = MarkdownInstance<PostFrontmatter>

interface PostFrontmatter extends InferEntrySchema<'posts'> {
    slug: string
    minutesRead: number
    excerpt: {
        html: string
        text: string
    }
}

export default PostService
export type {
    PostFrontmatter,
    PostInstance
}
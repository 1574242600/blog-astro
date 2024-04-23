import rss from '@astrojs/rss'
import PostService from '@service/postService'
import siteMetadata from '@data/siteMetadata.json'

export async function GET() {
    const ps = await PostService.init()
    const posts = ps.getPosts()

    return rss({
        title: siteMetadata.title,  
        description: siteMetadata.description,
        site: siteMetadata.siteUrl,
        items: posts.map(post => ({
            title: post.frontmatter.title,
            pubDate: post.frontmatter.date,
            description: post.frontmatter.excerpt.text,
            link: `/post/${post.frontmatter.slug}/`,
            categories: post.frontmatter.tags
        })),
        customData: '<language>zh-CN</language>' + 
                    `<lastBuildDate>${(new Date()).toUTCString()}</lastBuildDate>`
        ,
    })
}
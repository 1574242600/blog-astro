import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { initRemarkPluginFrontmatter } from '@utils/astro'

import siteMetadata from '@data/siteMetadata.json'

export async function GET() {
    const posts = await getCollection('posts')

    return rss({
        title: siteMetadata.title,  
        description: siteMetadata.description,
        site: siteMetadata.siteUrl,
        items: await Promise.all(posts.map(async post => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: initRemarkPluginFrontmatter((await post.render()).remarkPluginFrontmatter).excerpt.text,
            link: `/post/${post.slug}/`,
        }))),
        customData: '<language>zh-CN</language>',
    })
}
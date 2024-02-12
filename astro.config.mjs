import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/plugin/remark.mjs'
import rehypeExcerpt from 'astro-rehype-excerpt'
import remarkPrism from 'remark-prism'
import remarkCodeTitle from 'remark-code-title'
import sitemap from '@astrojs/sitemap'

import siteMetadata from './src/data/siteMetadata.json'
//todo RSS
export default defineConfig({
    site: siteMetadata.siteUrl,
    integrations: [tailwind(), solid(), sitemap()],
    markdown: {
        syntaxHighlight: false,
        remarkPlugins: [remarkReadingTime, remarkCodeTitle, [remarkPrism, {
            plugins: ['line-numbers']
        }]],
        rehypePlugins: [rehypeExcerpt]
    },
    redirects: {
        '/page/1': '/'
    }
})
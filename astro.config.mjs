import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/plugin/remark.mjs'
import rehypeExcerpt from 'astro-rehype-excerpt'
import sitemap from '@astrojs/sitemap'
import siteMetadata from './src/data/siteMetadata.json'
import expressiveCode from 'astro-expressive-code'

export default defineConfig({
    site: siteMetadata.siteUrl,
    integrations: [tailwind(), solid(), sitemap(), expressiveCode()],
    markdown: {
        syntaxHighlight: false,
        remarkPlugins: [remarkReadingTime],
        rehypePlugins: [rehypeExcerpt]
    },
    redirects: {
        '/page/1': '/'
    }
})
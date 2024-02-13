import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/plugin/remark.mjs'
import * as ShikiTF from './src/plugin/shiki.mjs'
import rehypeExcerpt from 'astro-rehype-excerpt'
import remarkCodeTitle from 'remark-code-title'
import sitemap from '@astrojs/sitemap'

import siteMetadata from './src/data/siteMetadata.json'


export default defineConfig({
    site: siteMetadata.siteUrl,
    integrations: [tailwind(), solid(), sitemap()],
    markdown: {
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'github-dark',
            transformers: [
                ShikiTF.deleteAstroTransformer,
            ],
        },
        remarkPlugins: [remarkReadingTime, remarkCodeTitle],
        rehypePlugins: [rehypeExcerpt]
    },
    redirects: {
        '/page/1': '/'
    }
})
import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/plugin/remark.mjs'
import sitemap from '@astrojs/sitemap'
import siteMetadata from './src/data/siteMetadata.json'
import expressiveCode from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

export default defineConfig({
    site: siteMetadata.siteUrl,
    integrations: [
        tailwind(), 
        solid(), 
        sitemap(), 
        expressiveCode({
            plugins: [pluginLineNumbers()],
            defaultProps: { 
                showLineNumbers: false
            }
        })
    ],
    markdown: {
        syntaxHighlight: false,
        remarkPlugins: [
            remarkReadingTime
        ]
    },
    redirects: {
        '/page/1': '/'
    }
})
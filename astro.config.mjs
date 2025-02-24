import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import { remarkReadingTime } from './src/plugin/remark.mjs'
import sitemap from '@astrojs/sitemap'
import siteMetadata from './src/data/siteMetadata.json'
import expressiveCode from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import decapCmsOauth from 'astro-decap-cms-oauth'
import cloudflare from '@astrojs/cloudflare'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    output: 'static',
    adapter: cloudflare(),
    site: siteMetadata.siteUrl,
    integrations: [
        icon(),
        solid(), 
        sitemap(), 
        expressiveCode({
            plugins: [pluginLineNumbers()],
            defaultProps: { 
                showLineNumbers: false
            }
        }),
        decapCmsOauth({
            oauthLoginRoute: '/admin/oauth',
            oauthCallbackRoute: '/admin/oauth/callback',
            decapCMSSrcUrl: 'https://cdn.jsdelivr.net/npm/decap-cms@^3.0.0/dist/decap-cms.js'
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
    },
    vite: {
        plugins: [tailwindcss()],
        ssr: {
            external: ['node:fs/promises']
        }
    }
})
import siteMetadata from '@data/siteMetadata.json'

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${siteMetadata.siteUrl}/sitemap-index.xml
`.trim()

export function GET() {
    return new Response(robotsTxt)
}
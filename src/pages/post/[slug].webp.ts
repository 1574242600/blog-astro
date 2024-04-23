import type { APIRoute } from 'astro'
import PostService from '@service/postService'
import satori from 'satori'
import sharp from 'sharp'
import { html } from 'satori-html'
import { readFontsFile } from '@utils/astro'
import { dateToString } from '@utils/browser'
import siteMetadata from '@data/siteMetadata.json'

export async function getStaticPaths() {
    const ps = await PostService.init()
    const posts = ps.getPosts()

    return posts
        .map((post) => ({ params: { slug: post.frontmatter.slug } }))
}

export const GET: APIRoute<object, { slug: string }> = async ({ params }) => {
    const ps = await PostService.init()
    const { slug } = params
    const { frontmatter } = ps.getPost(slug)


    const h = html`
<div tw="h-full w-full flex flex-col bg-gray-100 text-gray-600">
  <div tw="m-10 flex flex-col h-full">
    <h1 tw="text-6xl text-gray-800 font-bold">${frontmatter.title}</h1>

    <div tw="flex items-end mt-2">
      <span tw="text-4xl font-bold">${frontmatter.author}</span>
      <span tw="text-3xl text-gray-500 ml-6">${dateToString(frontmatter.date)}</span>
      <span tw="text-3xl text-gray-500 ml-6">预计阅读时长 ${frontmatter.minutesRead} 分</span>
    </div>

    <div tw="h-72 mt-12 text-4xl overflow-hidden">
        ${frontmatter.excerpt.text}
    </div>

    <div tw="flex justify-end mt-4 text-4xl">
      From <span tw="text-sky-500 ml-2">${siteMetadata.siteUrl}</span>
    </div>
  </div>
</div>
` 

    const svg = await satori(
        h,
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'WQY ZenHei',
                    data: await readFontsFile('wqy-zenhei.woff')
                },
            ],
            debug: false,
        },
    )
    
    const buffer = await sharp(Buffer.from(svg))
        .webp()
        .toBuffer()

    return new Response(buffer, {
        'headers': {
            'Content-Type': 'image/webp'
        }
    })
}
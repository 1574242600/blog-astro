import sharp from 'sharp'
import { GET as getFavicon } from './favicon.svg'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
///@ts-expect-error
import toIco from 'to-ico'

export async function GET() {
    const response = await getFavicon()
    const pngBuffer = await sharp(await response.arrayBuffer())
        .resize(64, 64)
        .png()
        .toBuffer()
    const icoBuffer = await toIco(pngBuffer)

    return new Response(icoBuffer, {
        'headers': {
            'Content-Type': 'image/x-icon'
        }
    })
}
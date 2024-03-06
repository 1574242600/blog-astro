import satori from 'satori'
import { readFontsFile } from '@utils/index'
import { html } from 'satori-html'

export async function GET() {
    const h = html`
        <div style="display: flex; width: 100%; height: 100%; backgroundColor: #22c55e">
            <div style="width: 100%; display: flex; flexDirection: column; alignItems: center;">
                <div style="height: 100%; display: flex; flexDirection: row; alignItems: center;">
                    <h1 style="marginBottom: 85px;fontSize: 550px; color: #e5e7eb">N</h1>
                </div>
            </div>
        </div>
    ` 

    const svg = await satori(
        h,
        {
            width: 512,
            height: 512,
            fonts: [
                {
                    name: 'WQY ZenHei',
                    data: await readFontsFile('wqy-zenhei.woff'),
                    weight: 600,
                    style: 'normal',
                },
            ],
            //debug: true,
        },
    )
    
    return new Response(svg, {
        'headers': {
            'Content-Type': 'image/svg+xml'
        }
    })
}
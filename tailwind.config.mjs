/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            margin: {
                '1/4': '25%'
            },
            screens: {
                '2xl-m': { max: '1535px' },
                'xl-m': { max: '1279px' },
                'lg-m': { max: '1023px' },
                'md-m': { max: '767px' },
                'sm-m': { max: '639px' }
            },
            width: {
                '3xl': '768px',
                '2xl': '672px',
                xl: '576px'
            },
            fontFamily: {
                'mono': ['ui-monospace', 'WQY ZenHei Mono']
            }
        }
    },
    plugins: []
}

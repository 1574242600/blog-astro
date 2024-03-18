import { defineEcConfig } from 'astro-expressive-code'

export default defineEcConfig({
    frames: {
        showCopyToClipboardButton: false,
    },
    styleOverrides: {
        frames: {
            shadowColor: '#ffffff00'
        },
    }
})
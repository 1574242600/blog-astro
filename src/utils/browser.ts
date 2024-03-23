/**
*   for Turbo
**/
export function addLoadEventListener(name: string, handler: () => void) {
    const temp = window.temp = window.temp || {}

    document.addEventListener('turbo:load', () => {
        if (temp[name]) {
            temp[name] = false
            return
        }
        
        handler()
    })

    handler()
    temp[name] = true
}

export function toDays(ms: number) {
    return Math.floor((ms / 1e3) / 86400)
}
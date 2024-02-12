import { createSignal, onMount, Show } from 'solid-js'
import type { Component } from 'solid-js'

export const Outdated: Component<OutdatedProps> = (props) => {
    const [ days, setDays ] = createSignal(0)

    onMount(() => {
        const { lastUpdate } = props
        setDays(toDays(Date.now() - new Date(lastUpdate).getTime()))
    })

    return (
        <Show
            when={days() > 90}
        >
            <div class='h-15 m-4 p-4 bg-amber-100 rounded border-2 border-amber-500'>
                <div class='text-amber-600 text-center'>本文最后更新于 {days()} 天前，文中所描述的信息可能已过时</div>
            </div>
        </Show>
    )
}

export interface OutdatedProps {
    lastUpdate: string
}

export default Outdated

export function toDays(ms: number) {
    return Math.floor((ms / 1e3) / 86400)
}
/* eslint-disable solid/no-innerhtml */
import { createSignal, onMount, Show } from 'solid-js'
import type { Component } from 'solid-js'

export const Svg: Component<SvgProps> = (props) => {
    const [svg, setSvg] = createSignal<string>('')

    onMount(() => {
        const path = `/svg/${props.id}.svg`
        fetch(path)
            .then(res => res.status === 200 ? res.text() : '')
            .then(text => setSvg(text))
            .catch(err => console.error(err))
    })

    return (
        <>
            <Show
                when={svg().length > 0}
            >

                <div class={props.class + ' align-middle'} innerHTML={svg()} />
            </Show>
        </>
    )
}

export interface SvgProps {
    id: string
    class?: string
}

export default Svg

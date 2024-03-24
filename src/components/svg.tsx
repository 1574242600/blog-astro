/* eslint-disable solid/no-innerhtml */
import { createSignal, onMount } from 'solid-js'
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
            <div class={props.className + ' align-middle'} innerHTML={svg()} />
        </>
    )
}

export interface SvgProps {
    id: string
    className?: string
}

export default Svg

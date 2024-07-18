import { children } from 'solid-js'
import type { Component, JSX } from 'solid-js'

const Menu: Component<MenuProps> = (props) => {
    const c = children(() => props.children || [])

    return <ul class='list-none list-inside w-full'>{c()}</ul>
}

const Item: Component<ItemProps> = (props) => {
    const activeClass = ' border-r-4 border-[--accent-color] bg-[--minor-color]'
    const textClass = ' font-mono font-medium text-md text-center hover:text-[--accent-color]'

    return (
        <li
            onClick={() => props.onClick()}
            class={
                'h-10 leading-10 hover:bg-[--accent-bg-color]' +
                textClass +
                (props.active ? activeClass : '')
            }
        >
            {props.children}
        </li>
    )
}

export interface ItemProps {
    active: boolean,
    onClick: () => void,
    children: JSX.Element
}

export interface MenuProps {
    children: JSX.Element
}

export {
    Menu,
    Item
}

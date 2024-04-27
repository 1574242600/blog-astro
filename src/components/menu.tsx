import { createSignal, onMount, children } from 'solid-js'
import type { Component, JSX } from 'solid-js'

const Menu: Component<MenuProps> = (props) => {
    const c = children(() => props.children || [])

    onMount(() => {
        const nodes = c.toArray()
        let lastActiveE: HTMLLIElement | null = null

        nodes.forEach((node, index) => {
            if (node instanceof HTMLLIElement) {
                setTimeout(() => {
                    if (node.dataset.key === props.defaultActiveKey) {
                        node.setAttribute('data-active', 'true')
                        lastActiveE = node
                    } else node.setAttribute('data-active', 'false')
                }, 50)
                
                node.addEventListener('click', (e) => {
                    if (node === lastActiveE) return
                    lastActiveE && lastActiveE.setAttribute('data-active', 'false')
                    node.setAttribute('data-active', 'true')
                    
                    lastActiveE = e.currentTarget as HTMLLIElement
                    props.onItemActiveChange && props.onItemActiveChange(node.dataset.key || '', index)
                })
            }
        })
        
    })

    return <ul class='list-none list-inside w-full'>{c()}</ul>
}

const Item: Component<ItemProps> = (props) => {
    const [active, setActive] = createSignal(false)
    let li: HTMLLIElement

    const activeClass = ' border-r-4 border-[--accent-color] bg-[--minor-color]'
    const textClass = ' font-mono font-medium text-md text-center hover:text-[--accent-color]'

    onMount(() => {
        li.setAttribute('data-key', props.key)

        const observer = new MutationObserver((records) => {
            if (records[0].attributeName === 'data-active') {
                const a = li.dataset.active === 'true'
                setActive(a)
            }
        })

        observer.observe(li, { attributes: true })
    })

    return (
        <li
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /// @ts-expect-error
            ref={li}
            class={
                'h-10 leading-10 hover:bg-[--accent-bg-color]' +
                textClass +
                (active() ? activeClass : '')
            }
        >
            {props.children}
        </li>
    )
}

export interface ItemProps {
    key: string,
    children: JSX.Element
}

export interface MenuProps {
    children: JSX.Element
    defaultActiveKey: string
    onItemActiveChange?: (key: string | null, index: number) => void
}

export {
    Menu,
    Item
}

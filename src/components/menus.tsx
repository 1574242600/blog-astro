import { For, createSignal, onMount } from 'solid-js'
import type { Accessor, Component, Setter } from 'solid-js'
import { Menu, Item } from './menu'
import Svg from './svg.astro'

const Menus: Component<MenusProps> = (props) => {
    const [items, setItems] = createSignal<ItemSignal[]>([]) 

    onMount(() => {
        const items = props.data.map(item => {
            const [active, setActive] = createSignal(props.defaultActiveKey === item.path) 

            return {
                id: item.path,
                active, 
                setActive
            }
        })

        setItems(items)
    })

    const getItemById = (id: string) => items().find(v => v.id === id)

    return (
        <Menu>
            <For each={props.data}>
                {m => (
                    <Item 
                        active={getItemById(m.path)?.active() || false} 
                        onClick={() => {
                            items().find(v => v.active() === true)?.setActive(false)
                            getItemById(m.path)?.setActive(true)
                        }}
                    >
                        <a href={m.path}>
                            <div>
                                {/* <Svg id={m.svgId} class='w-4 h-4 mr-6 inline-block'/> */}
                                {m.name}
                            </div>
                        </a>
                    </Item>
                )}
            </For>
        </Menu>
    )
}

export default Menus

export interface MenusProps {
    data: {
        name: string
        svgId: string
        path: string
    }[]
    defaultActiveKey: string
}

interface ItemSignal {
    id: string
    active: Accessor<boolean>
    setActive: Setter<boolean>
}
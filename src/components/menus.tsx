/*
<Menu
    defaultActiveKey={defaultActiveKey}
    client:only="solid"        
>
{      
    menu.map(m => (
        <Item key={m.path} client:only="solid">
            <div href={m.path}>
                <div class='w-3/4 ml-2'>
                    <Svg id={m.svgId} class='w-5 h-5 mr-4 inline-block' client:only="solid"/>
                        {m.name}
                </div>
            </div>
        </Item>
    ))
}
</Menu>

直接这么用的话，Menu 组件 children 会被 astro 处理, 而用 For 也有问题, 所以在这里再包一层

*/

import { For } from 'solid-js'
import type { Component } from 'solid-js'
import { Menu, Item } from './menu'
import Svg from './svg'

const Menus: Component<MenusProps> = (props) => {
    return (
        <Menu defaultActiveKey={props.defaultActiveKey}>
            <For each={props.data}>
                {m => (
                    <Item key={m.path} >
                        <a href={m.path}
                            onClick={
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                /// @ts-expect-error todo 重构 Sidebar
                                () => setTimeout(() => window.setXOffset(-256), 150)
                            }>
                            <div>
                                <Svg id={m.svgId} class='w-4 h-4 mr-6 inline-block'/>
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
        name: string,
        svgId: string
        path: string
    }[]
    defaultActiveKey: string
}
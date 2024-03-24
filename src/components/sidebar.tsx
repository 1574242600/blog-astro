import { createSignal } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import { useSwipe } from './hooks/use-swipe'

const Sidebar: Component<SidebarProps> = (props) => {
    const [xOffset, setXOffset] = createSignal(-256)
    const [isOpen, setIsOpen] = createSignal(props.defaultOpenOnMobile)

    // todo 重构 Sidebar
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /// @ts-expect-error 
    window.setXOffset = setXOffset
    const bodyScrDisable = scrController()
    //---

    useSwipe(
        {
            onSwipe: event => {
                const xOff = xOffset()
                const { firstDirection } = event
                if (firstDirection === 4 || firstDirection === 6) {
                    if (firstDirection === 4 && xOff === -256) return
                    if (firstDirection === 6 && xOff === 0) return

                    let offset = event.offset.cX - (firstDirection === 6 ? 256 : 0)
                    if (offset > 0) offset = 0
                    if (offset < -256) offset = -256

                    setXOffset(offset)
                    
                }
            },
            onSwipeEnd: () => {
                const xOff = xOffset()
                if (isOpen()) {
                    xOff < -10 ? setXOffset(-256) : setXOffset(0)
                } else {
                    xOff < -246 ? setXOffset(-256) : setXOffset(0)
                }

                setIsOpen(xOffset() === 0)
                bodyScrDisable(false)
            }, 
            onSwipeStart: event => { 
                if (event.direction === 6) bodyScrDisable(true)
            }
        },
        {
            timeDiff: 10,
            throttleDelay: 10
        }
    )

    const lgClass = ' lg:absolute lg:!left-auto'
    const lgMClass = ' lg-m:fixed lg-m:z-10'

    return (
        <div>
            <div
                class={
                    'h-full w-64' + lgClass + lgMClass + ' bg-[--primary-bg-color] shadow'
                }
                style={{
                    left: `${xOffset()}px`,
                    transition: (xOffset() === 0 || xOffset() === -256) ? 'all 0.5s' : ''
                }}
            >
                {props.children}
            </div>

            <div
                class='lg:hidden fixed h-full w-full bg-black'
                style={{
                    'z-index': xOffset() !== -256 ? 1 : -1,
                    opacity: (Math.abs(xOffset() + 256) / 512).toFixed(2),
                    transition: (xOffset() === 0 || xOffset() === -256) ? 'all 0.5s' : ''
                }}
                onClick={() => setXOffset(-256)}
            />
        </div>
    )
}

export interface SidebarProps {
    children: JSX.Element
    defaultOpenOnMobile?: boolean
}

export default Sidebar

function scrController() {
    const div = document.getElementById('body')

    return (bool: boolean) => {
        if (!div) return

        if (bool) {
            div.style.overflow = 'hidden'
        } else {
            div.style.overflow = ''
        }
    }
}
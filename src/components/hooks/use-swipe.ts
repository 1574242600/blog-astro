import { createEffect, onMount, onCleanup, on } from 'solid-js'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import { throttle } from 'throttle-debounce'

export const useSwipe = (
    handlers: SwipeEventHandlers,
    settings: SwipeSettings = { timeDiff: 100, throttleDelay: 50 }
): void => {
    const { onSwipeStart, onSwipeEnd, onSwipe } = handlers

    const [swipeState, setSS] = createStore<SwipeState>({
        isSwipeEnd: false,
        isSwipeStart: false,
        firstDirection: null,
        XYT: {
            pX: 0,
            pY: 0,
            cX: 0,
            cY: 0,
            time: 0
        },
        startXYT: {
            pX: 0,
            pY: 0,
            cX: 0,
            cY: 0,
            time: 0
        },
        lastXYT: null
    })

    const hanleTouchStartBinded = hanleTouchStart.bind(null, setSS)
    const hanleTouchEndBinded = hanleTouchEnd.bind(null, setSS)
    const hanleTouchMoveBinded = throttle(settings.throttleDelay, hanleTouchMove.bind(null, setSS, swipeState, settings, onSwipe))
    onMount(() => {
        addEventListener('touchstart', hanleTouchStartBinded)
        addEventListener('touchmove', hanleTouchMoveBinded)
        addEventListener('touchend', hanleTouchEndBinded)
    })

    onCleanup(() => {
        removeEventListener('touchstart', hanleTouchStartBinded)
        removeEventListener('touchend', hanleTouchEndBinded)
        removeEventListener('touchmove', hanleTouchMoveBinded)
    })

    createEffect(on(() => swipeState.isSwipeStart, (isSwipeStart) => {
        if (!isSwipeStart) return
        const { XYT, startXYT } = swipeState
        const event = toSwipeEvent(XYT, startXYT, null)

        onSwipeStart?.(event)
    }, { defer: true}))

    createEffect(on(() => swipeState.isSwipeEnd, () => {
        const { XYT, startXYT, isSwipeStart, firstDirection } = swipeState
        if (!isSwipeStart) return

        setTimeout(() => {
            onSwipeEnd?.(toSwipeEvent(XYT, startXYT, firstDirection))
        }, 100)
    }, { defer: true}))
}

function hanleTouchStart (
    setSS: SetStoreFunction<SwipeState>,
    event: TouchEvent
): void {
    const tmp = toXYT(event)
    setSS({
        startXYT: tmp,
        XYT: tmp
    })
}

function hanleTouchEnd (
    setSS: SetStoreFunction<SwipeState>
): void {
    setSS((swipeState) => { return { isSwipeEnd: swipeState.isSwipeStart } })
    setSS({
        isSwipeStart: false,
        isSwipeEnd: false,
        lastXYT: null,
        firstDirection: null
    })
}

function hanleTouchMove (
    setSS: SetStoreFunction<SwipeState>,
    swipeState: SwipeState,
    settings: SwipeSettings,
    onSwipe: SwipeEventHandlers['onSwipe'],
    event: TouchEvent
): void {
    const XYT = toXYT(event)
    setSS({ XYT })

    const { startXYT, lastXYT, isSwipeStart, firstDirection } = swipeState
    const timeDiff = XYT.time - startXYT.time
    const swipeEvnet = toSwipeEvent(XYT, startXYT, firstDirection)

    if (timeDiff > settings.timeDiff || lastXYT != null) {
        if (!isSwipeStart) {
            if (Math.abs(swipeEvnet.offset.cX) > 20 || Math.abs(swipeEvnet.offset.cY) > 20) 
                setSS({isSwipeStart: true,firstDirection: swipeEvnet.direction })
            return
        }

        /*
            if (lastXYT != null) { // 中途滑动方向改变判断
                const lastSwipeEvnet = toSwipeEvent(lastXYT, startXYT)
                if (lastSwipeEvnet.direction === 4) swipeEvnet.offset.cX - lastSwipeEvnet.offset.cX > 0 && setStartXYT(XYT)
                if (lastSwipeEvnet.direction === 6) swipeEvnet.offset.cX - lastSwipeEvnet.offset.cX < 0 && setStartXYT(XYT)
                if (lastSwipeEvnet.direction === 8) swipeEvnet.offset.cY - lastSwipeEvnet.offset.cY < 0 && setStartXYT(XYT)
                if (lastSwipeEvnet.direction === 2) swipeEvnet.offset.cY - lastSwipeEvnet.offset.cY > 0 && setStartXYT(XYT)
            } */

        onSwipe?.(toSwipeEvent(XYT, startXYT, firstDirection))
        setSS('lastXYT', XYT)
    }
}

function toXYT (event: TouchEvent): XYT {
    return {
        pX: event.touches[0].pageX,
        pY: event.touches[0].pageY,
        cX: event.touches[0].clientX,
        cY: event.touches[0].clientY,
        time: new Date().getTime()
    }
}

function toSwipeEvent (XYT: XYT, startXYT: XYT, firstDirection: SwipeDirection): SwipeEvnet {
    function getDirection (
        xOffest: number,
        yOffest: number
    ): SwipeEvnet['direction'] {
        const diff = Math.abs(xOffest) - Math.abs(yOffest)

        if (diff < 0) return yOffest > 0 ? 2 : 8
        if (diff > 0) return xOffest > 0 ? 6 : 4

        return null
    }

    const pXOffest = XYT.pX - startXYT.pX
    const pYOffest = XYT.pY - startXYT.pY
    const cXOffest = XYT.cX - startXYT.cX
    const cYOffest = XYT.cY - startXYT.cY

    return {
        firstDirection,
        direction: getDirection(pXOffest, pYOffest),
        offset: {
            pX: pXOffest,
            pY: pYOffest,
            cX: cXOffest,
            cY: cYOffest
        },
        XYT,
        startXYT
    }
}

interface SwipeState {
    isSwipeStart: boolean
    isSwipeEnd: boolean
    firstDirection: SwipeDirection
    XYT: XYT
    startXYT: XYT
    lastXYT: XYT | null
}

interface XYT {
    pX: number
    pY: number
    cX: number
    cY: number
    time: number
}

export interface SwipeEventHandlers {
    onSwipeStart?: (event: SwipeEvnet) => void
    onSwipeEnd?: (event: SwipeEvnet) => void
    onSwipe?: (event: SwipeEvnet) => void
}

export interface SwipeSettings {
    timeDiff: number
    throttleDelay: number
}

export interface SwipeEvnet {
    firstDirection: SwipeDirection
    direction: SwipeDirection
    offset: Omit<XYT, 'time'>
    XYT: XYT
    startXYT: XYT
}

export type SwipeDirection = 4 | 8 | 6 | 2 | null // number pad

import { createSignal, onCleanup } from 'solid-js'
import type { Component } from 'solid-js'

export const Age: Component<AgeProps> = (props) => {
    const [date, setDate] = createSignal<Date>(new Date)

    const i = setInterval(() => {
        setDate(new Date)
    }, 1000)

    onCleanup(() => clearInterval(i))

    return (
        <div>博客已存活: {toStr(new Date(props.since), date())}</div>
    )
}

export interface AgeProps {
    since: string
}

export default Age

function toStr (birthDay: Date, today: Date): string {
    const timeold = (today.getTime() - birthDay.getTime())
    const msPerDay = 24 * 60 * 60 * 1000
    const eDaysold = timeold / msPerDay
    const daysold = Math.floor(eDaysold)
    const eHrsold = (eDaysold - daysold) * 24
    const hrsold = Math.floor(eHrsold)
    const eMinsold = (eHrsold - hrsold) * 60
    const minsold = Math.floor((eHrsold - hrsold) * 60)
    const seconds = Math.floor((eMinsold - minsold) * 60)
    return (`${daysold}天${hrsold}小时${minsold}分${seconds}秒`)
}

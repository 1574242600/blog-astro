/* eslint-disable solid/no-innerhtml */
import { ErrorBoundary, For, Show, createResource, createSignal } from 'solid-js'
import { dateToString } from '@utils/browser'
import type { Component } from 'solid-js'

const FriendsActivity: Component<FriendsActivityProps> = (props) => {
    //todo 虚拟列表，滑动加载 过度
    const [page, /*setPage*/] = createSignal(0)
    const [friendsActivity] = createResource(page, fetchFriendsActivity.bind(null, props.apiUrl))

    return (
        <div class={'flex flex-col w-full h-full overflow-y-auto'}>
            <ErrorBoundary fallback={err => <ErrorInfo error={err} /> }>
                <Show
                    when={friendsActivity()}
                    fallback={<Loading />}
                >
                    <For each={friendsActivity()}>
                        {(item) =>  <FriendsActivityItem {...item} />}
                    </For>
                </Show>
            </ErrorBoundary>
        </div>
    )
}

const FriendsActivityItem: Component<FriendsActivityItemProps> = (props) => {
    return (
        <div 
            class={
                'flex flex-row p-2 '  
                + 'hover:bg-[--accent-bg-color] border-b border-[--divider-color] '
                + 'lg-m:flex-col'
            }
        >
            <div 
                class={
                    'lg-m:mb-4 lg:w-28 lg:mr-2 lg:text-center ' 
                    + 'lg:border-r-2 lg:border-[--divider-color] '
                    + 'font-bold truncate'
                }
                title={props.siteName}
            >{props.siteName}</div>
            <div class='grow'>
                <a
                    class='hover:text-[--link-hover-text-color]'
                    title={props.title}
                    aria-label={props.title}
                    href={props.url}
                    target='_blank'
                >
                    {props.title}
                </a>
            </div>
            <div>{dateToString(new Date(+props.date * 1000))}</div>
        </div>
    )
}

const Loading: Component = () => {
    return (
        <div class='flex flex-col w-full h-full text-center justify-center'>
            <div class='text-4xl font-mono animate-pulse'>加载中...</div>
        </div>
    )
}

const ErrorInfo: Component<{ error: Error }> = (props) => {
    return (
        <div>{props.error.message}</div>
    )
}

function fetchFriendsActivity(apiUrl: string, page: number): Promise<FriendsActivityItem[]> {
    const url = new URL(apiUrl)
    url.searchParams.append('items', '20')
    url.searchParams.append('offset', String(page * 20))

    return fetch(url)
        .then(async r => {
            const result = await r.json()
            if (r.status !== 200)  throw new Error(result.msg)

            return result.list
        })
}

export interface FriendsActivityItem {
    url: string,
    date: number,
    title: string,
    siteName: string
}

export interface FriendsActivityProps {
    apiUrl: string
}

export type FriendsActivityItemProps = FriendsActivityItem

export default FriendsActivity

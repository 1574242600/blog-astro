import { mergeProps } from 'solid-js'
import type { Component, JSX } from 'solid-js'

export const Pagination: Component<PaginationProps> = (props) => {
    const pagesCount = props.pagePaths.length
    //todo 重构
    return (
        <div class='flex flex-row space-x-2 justify-center'>
            {props.currentPage - 1 > 0 && <PageNumber text='<' pagePath={props.pagePaths[props.currentPage - 1 - 1]} />}
            {renderPageNumber(pagesCount, props.lengthLimit, props.currentPage, props.pagePaths)}
            {props.currentPage + 1 <= pagesCount && <PageNumber text='>' pagePath={props.pagePaths[props.currentPage + 1 - 1]} />}
        </div>
    )
}

const PageNumber: Component<PageNumberProps> = (props) => {
    const merged = mergeProps({ pagePath: '', test: null, active: false, className: ''}, props)
    const activeClass = ' border-green-400 text-green-500'
    const hoverClass = ' hover:border-green-400 hover:text-green-500'

    return (
        <a 
            class={
                'h-8 w-8 pt-1 border border-gray-300 text-gray-600 text-center cursor-pointer' 
                + hoverClass
                + (merged.active ? activeClass : '')
                + merged.className
            } 
            href={merged.pagePath}
        >
            { merged.text }
        </a>
    )
}

const renderPageNumber = (
    total: number,
    lengthLimit: number,
    currentPage: number,
    pagePaths: string[]
): JSX.Element => {
    const items = []

    for (let i = 0; i < Math.floor(lengthLimit / 2); i++) {
        if (currentPage - i > 0) {
            const page = currentPage - i
            items.unshift(<PageNumber text={page + ''} pagePath={pagePaths[page - 1]} active={currentPage === page}/>)
        }
    }

    for (let i = 0; items.length < lengthLimit; i++) {
        if (currentPage + i < total) {
            const page = currentPage + i + 1
            if (items.length === lengthLimit - 1) {
                // eslint-disable-next-line solid/no-react-specific-props
                items.push(<PageNumber text='...' className='!cursor-default' />)
                break
            }

            items.push(<PageNumber text={page + ''} pagePath={pagePaths[page - 1]} />)
        } else break
    }

    return items
}

export default Pagination

export interface PaginationProps {
    pagePaths: string[]
    currentPage: number
    lengthLimit: number
}

interface PageNumberProps {
    pagePath?: string
    active?: boolean
    text?: string
    className?: string
}

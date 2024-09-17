import React from 'react'
import sanitizeHtml, { type IOptions } from 'sanitize-html';

type Props = {
    children: string
    className?: string
} & IOptions



const SanitizedDOM = ({ children, className, ...options }: Props) => {
    const santiziedChildren = sanitizeHtml(children, options ?? {
        allowedTags: [],
        allowedAttributes: {
            img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
        }
    })
    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: santiziedChildren }} />
    )
}

export default SanitizedDOM
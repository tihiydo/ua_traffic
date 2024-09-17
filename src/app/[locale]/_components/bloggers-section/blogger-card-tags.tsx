'use client'

import BloggerTagBadge from '@/components/ui/custom/badges/tags/blogger-tag-badge'
import { cn } from '@/lib/utils'
import { type BloggerTag } from '@prisma/client'
import React from 'react'

type Props = {
    tags: BloggerTag[]
    className?: string;
}

const BloggerCardTags = ({ tags, className }: Props) => {
    return (
        <ul className={cn("flex gap-2 items-center justify-center my-1", className)}>
            {tags.map(tag => (
                <li onClick={(e) => e.stopPropagation()} key={tag} >
                    <BloggerTagBadge tag={tag} />
                </li>
            ))}
        </ul>
    )
}

export default BloggerCardTags
'use client'

import Translate from '@/components/Translate';
import { type BloggerTag } from '@prisma/client'
import React from 'react'
import TagBadge from './tag-badge';
import { twMerge } from 'tailwind-merge';
import TouchHoverPopover from '../../touch-hover-popover';
import { BadgePlusIcon, ShieldIcon } from 'lucide-react';

type Props = {
    tag: BloggerTag;
    className?: string;
}

const BloggerTagBadge = ({ tag, className }: Props) => {
    if (tag === 'New') {
        return <TouchHoverPopover
            trigger={
                <button>
                    <TagBadge className={twMerge(className)}>
                        <BadgePlusIcon className='w-full h-full' />
                    </TagBadge>
                </button>
            }
        >
            <Translate namespace='Blogger-Tags' itemKey={tag} />
        </TouchHoverPopover>
    }

    if (tag === 'Trusted') {
        return <TouchHoverPopover
            trigger={
                <button>
                    <TagBadge className={twMerge(className)}>
                        <ShieldIcon className='w-full h-full' />
                    </TagBadge>
                </button>
            }
        >
            <Translate namespace='Blogger-Tags' itemKey={tag} />
        </TouchHoverPopover>
    }
}

export default BloggerTagBadge
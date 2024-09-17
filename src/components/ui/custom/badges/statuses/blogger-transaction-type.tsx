import React from 'react'
import StatusBadge from './status-badge';
import { twMerge } from 'tailwind-merge';
import Translate from '@/components/Translate';
import { BloggerTransactionType } from '@/types/history/blogger';

type Props = {
    type: BloggerTransactionType;
    className?: string;
}

const BloggerTransactionTypeBadge = ({ className, type }: Props) => {
    if (type === 'Request') {
        return (
            <StatusBadge className={twMerge('bg-light-green', className)}>
                <Translate namespace='Transaction.Blogger' itemKey={`${type}.name`} />
            </StatusBadge>
        )
    }

    if (type === 'Withdraw') {
        return (
            <StatusBadge className={twMerge('bg-red', className)}>
                <Translate namespace='Transaction.Blogger' itemKey={`${type}.name`} />
            </StatusBadge>
        )
    }
}

export default BloggerTransactionTypeBadge
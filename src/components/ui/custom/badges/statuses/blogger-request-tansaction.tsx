import React from 'react'
import StatusBadge from './status-badge';
import { type AdRequestTransactionStatus } from '@prisma/client';
import { twMerge } from 'tailwind-merge';
import Translate from '@/components/Translate';

type Props = {
    status: AdRequestTransactionStatus;
    className?: string;
}

const BloggerRequestTransactionStatusBadge = ({ className, status }: Props) => {
    if (status === 'Hold') {
        return (
            <StatusBadge className={twMerge('bg-yellow-secondary', className)}>
                <Translate namespace='Transaction.Blogger.Request.Status' itemKey={status} />
            </StatusBadge>
        )
    }

    if (status === 'Done') {
        return (
            <StatusBadge className={twMerge('bg-light-green', className)}>
                <Translate namespace='Transaction.Blogger.Request.Status' itemKey={status} />
            </StatusBadge>
        )
    }

    if (status === 'Cancelled') {
        return (
            <StatusBadge className={twMerge('bg-red', className)}>
                <Translate namespace='Transaction.Blogger.Request.Status' itemKey={status} />
            </StatusBadge>
        )
    }
}

export default BloggerRequestTransactionStatusBadge
import React from 'react'
import StatusBadge from './status-badge';
import { type WithdrawTransactionStatus } from '@prisma/client';
import { twMerge } from 'tailwind-merge';
import Translate from '@/components/Translate';

type Props = {
    status: WithdrawTransactionStatus;
    className?: string;
}

const WithdrawTransactionStatusBadge = ({ className, status }: Props) => {
    if (status === 'Done') {
        return (
            <StatusBadge className={twMerge('bg-light-green', className)}>
                <Translate namespace='Transaction.Blogger.Withdraw.Status' itemKey={'Done'} />
            </StatusBadge>
        )
    }

    if (status === 'Processing') {
        return (
            <StatusBadge className={twMerge('bg-yellow-secondary', className)}>
                <Translate namespace='Transaction.Blogger.Withdraw.Status' itemKey={'Processing'} />
            </StatusBadge>
        )
    }
}

export default WithdrawTransactionStatusBadge
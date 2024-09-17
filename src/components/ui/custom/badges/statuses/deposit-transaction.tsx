import React from 'react'
import StatusBadge from './status-badge';
import { type DepositTransactionStatus } from '@prisma/client';
import { twMerge } from 'tailwind-merge';
import Translate from '@/components/Translate';
import { Link } from 'lucide-react';

type Props = {
    status: DepositTransactionStatus;
    className?: string;
    children?: React.ReactNode;
}

const DepositTransactionStatusBadge = ({ className, status, children }: Props) => {
    if (status === 'Processing') {
        return (
            <StatusBadge className={twMerge('bg-yellow-secondary', className)}>
                {children ?? (
                    <React.Fragment>
                        <Translate namespace='Transaction.Advertiser.Deposit.Status' itemKey={'Processing'} />
                        <Link />
                    </React.Fragment>
                )}
            </StatusBadge>
        )
    }

    if (status === 'Done') {
        return (
            <StatusBadge className={twMerge('bg-light-green', className)}>
                <Translate namespace='Transaction.Advertiser.Deposit.Status' itemKey={'Done'} />
            </StatusBadge>
        )
    }

    if (status === 'Declined') {
        return (
            <StatusBadge className={twMerge('bg-red', className)}>
                <Translate namespace='Transaction.Advertiser.Deposit.Status' itemKey={'Declined'} />
            </StatusBadge>
        )
    }

    if (status === 'Expired') {
        return (
            <StatusBadge className={twMerge('bg-gray-secondary', className)}>
                <Translate namespace='Transaction.Advertiser.Deposit.Status' itemKey={'Expired'} />
            </StatusBadge>
        )
    }
}

export default DepositTransactionStatusBadge
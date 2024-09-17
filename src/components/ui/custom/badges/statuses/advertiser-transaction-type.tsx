import React from 'react'
import StatusBadge from './status-badge';
import { twMerge } from 'tailwind-merge';
import Translate from '@/components/Translate';
import { type AdvertiserTransactionType } from '@/types/history/advertiser';

type Props = {
    type: AdvertiserTransactionType;
    className?: string;
}

const AdvertiserTransactionTypeBadge = ({ className, type }: Props) => {
    if (type === 'Request') {
        return (
            <StatusBadge className={twMerge('bg-red', className)}>
                <Translate namespace='Transaction.Advertiser' itemKey={`${type}.name`} />
            </StatusBadge>
        )
    }

    if (type === 'Deposit') {
        return (
            <StatusBadge className={twMerge('bg-light-green', className)}>
                <Translate namespace='Transaction.Advertiser' itemKey={`${type}.name`} />
            </StatusBadge>
        )
    }
}

export default AdvertiserTransactionTypeBadge
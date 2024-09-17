import React from 'react'
import StatusBadge from '@/components/ui/custom/badges/statuses/status-badge';
import { type IGCookieStatus } from '@prisma/client';
import { twMerge } from 'tailwind-merge';

type Props = {
    status: IGCookieStatus;
    className?: string;
}

const IGCookieStatusBadge = ({ className, status }: Props) => {
    if (status === 'Active') {
        return (
            <StatusBadge className={twMerge('bg-light-green', className)}>
                Активні
            </StatusBadge>
        )
    }

    if (status === 'Paused') {
        return (
            <StatusBadge className={twMerge('bg-gray-secondary', className)}>
                Зупинені
            </StatusBadge>
        )
    }

    if (status === 'Broken') {
        return (
            <StatusBadge className={twMerge('bg-red', className)}>
                Зломані
            </StatusBadge>
        )
    }
}

export default IGCookieStatusBadge
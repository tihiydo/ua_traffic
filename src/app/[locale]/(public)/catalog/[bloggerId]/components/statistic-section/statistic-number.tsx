import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
    increase: number;
    children: React.ReactNode
    className?: string;
}

const StatisticNumber = ({ increase, className, children }: Props) => {
    return (
        <div
            className={cn(increase > 0 ? 'text-success' : increase < 0 ? 'text-destructive' : 'text-gray-secondary', className)}
        >
            {increase > 0 && '+'}{children}
        </div>
    )
}

export default StatisticNumber
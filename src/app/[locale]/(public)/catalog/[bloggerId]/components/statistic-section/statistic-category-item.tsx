import { type StatisticCategoryItem as TStatisticCategoryItem } from '@/database/blogger/statistic';
import { cn } from '@/lib/utils';
import React from 'react'
import StatisticNumber from './statistic-number';
import { MinusIcon } from 'lucide-react';

type Props = {
    className?: string;
    item: TStatisticCategoryItem;
    show?: boolean
}

const StatisticCategoryItem = ({ item, className, show = true }: Props) => {
    return (
        <div className={cn('flex gap-1 justify-end', className)}>
            {show ? (
                <>
                    <StatisticNumber increase={item.increase}>
                        {item.increase.toLocaleString()}
                    </StatisticNumber>
                    <p className='text-main/60'>
                        ({item.increasePercentage > 0 ? '+' : ''}{item.increasePercentage}%)
                    </p>
                </>
            ) : (
                <MinusIcon className='text-main/60 max-h-[20px]'  />
            )}

        </div>
    )
}

export default StatisticCategoryItem
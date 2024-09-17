import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
}

const NotificationCardSkeleton = ({ className }: Props) => {
    return (
        <div className={cn('px-3 py-4 rounded-md border border-gray-secondary mb-2', className)}>
            <Skeleton className='w-[60%] h-3' />

            <div className='mt-4'>
                <div className='flex gap-2 mb-1.5'>
                    <Skeleton className='h-2 w-[40%]' />
                    <Skeleton className='h-2 w-[35%]' />
                </div>
                <div className='flex gap-2 mb-1.5'>
                    <Skeleton className='h-2 w-[20%]' />
                    <Skeleton className='h-2 w-[55%]' />
                </div>
                <Skeleton className='h-2 w-[60%]' />
            </div>
        </div>
    )
}

export default NotificationCardSkeleton
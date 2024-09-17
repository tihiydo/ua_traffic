
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import React from 'react'
import { twMerge } from 'tailwind-merge';

type Props = {
    timestamp: number;
    className?: string;
    withTooltip?: boolean;
}

const MessageDate = ({ timestamp, className, withTooltip = true }: Props) => {

    if (withTooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className={twMerge('text-xs md:text-sm', className)}>
                        {format(new Date(timestamp), 'HH:mm')}
                    </TooltipTrigger>
                    <TooltipContent className='text-center text-xs md:text-sm'>
                        <div>
                            {format(new Date(timestamp), 'dd.MM.yyyy')}
                        </div>

                        <div>
                            {format(new Date(timestamp), 'HH:mm')}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return <div className={twMerge('text-xs md:text-sm', className)}>
        {format(new Date(timestamp), 'HH:mm')}
    </div>
}

export default MessageDate
'use client'

import { cn } from '@/lib/utils';
import { useGuideHintContext } from './guide-hint-context';
import Translate from '@/components/Translate';

type Props = {
    className?: string;
    showTriangle?: boolean;
}

const GuideHint = ({ className, showTriangle = false }: Props) => {
    const { task, isActive, } = useGuideHintContext();

    if (!isActive || !task) return;

    return (
        <div
            className={cn('absolute left-1/2 text-sm -bottom-6 translate-y-full w-[200px] h-fit -translate-x-1/2 bg-yellow z-[100] p-2 rounded-md', className)}
        >
            {showTriangle && (
                <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[9px] border-l-transparent border-b-[9px] border-b-yellow border-r-[9px] border-r-transparent' />
            )}
            <Translate namespace='guidetasks' itemKey={task.tooltipText} />
        </div>
    )
}

export default GuideHint
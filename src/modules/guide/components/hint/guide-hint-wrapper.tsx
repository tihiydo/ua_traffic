'use client'

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { type TaskCategory } from '../../types';
import { useGuideStore } from '../../hooks/use-guide-store';
import GuideHintContextProvider from './guide-hint-context';

type Props = {
    className?: string;
    taskId: string;
    shouldRenderHint?: boolean
    children: React.ReactNode | ((isActive: boolean) => React.ReactNode)
}

const GuideHintWrapper = ({ children, taskId, className, shouldRenderHint = true }: Props) => {
    const activeTask = useGuideStore((state) => state.activeTask)
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(
            !!activeTask &&
            taskId === activeTask.id
        )
    }, [activeTask, taskId])


    if (!shouldRenderHint) {
        return <>
            {children}
        </>
    }

    return (
        <GuideHintContextProvider
            task={activeTask}
            isActive={isActive}
            closeHint={() => {
                //
            }}
        >
            <div
                className={cn('relative ', isActive ? 'outline outline-4 outline-[#ffc107] outline-offset-4' : '', className)}
                onClick={() => {
                    setIsActive(false)
                }}
            >
                {typeof children === 'function'
                    ? children(isActive)
                    : <> {children}</>
                }
            </div>
        </GuideHintContextProvider>
    )
}

export default GuideHintWrapper
import { cn } from '@/lib/utils';
import React, { type ComponentProps } from 'react'

type Props = {
    isActive: boolean
    children: React.ReactNode;
} & ComponentProps<'button'>

const TabButton = ({ isActive, children, className, ...props }: Props) => {
    return (
        <button
            type='button'
            className={cn(
                `relative flex  gap-2 items-center font-title uppercase justify-center whitespace-nowrap rounded-sm p-0 text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50    px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-['']`,
                isActive ? "after:w-full" : '',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default TabButton
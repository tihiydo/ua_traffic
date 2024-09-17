import React from 'react'
import { twMerge } from 'tailwind-merge';


type Props = {
    className?: string;
    children?: React.ReactNode;
}

const StatusBadge = ({ children, className }: Props) => {
    return (
        <div
            className={twMerge(
                "w-full rounded-[50px] text-center text-sm py-1 px-3 max-w-[150px]",
                className,
            )}
        >
            {children}
        </div>
    )
}

export default StatusBadge
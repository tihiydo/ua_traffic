import React from 'react'
import { twMerge } from 'tailwind-merge';


type Props = {
    className?: string;
    children?: React.ReactNode;
}

const TagBadge = ({ children, className }: Props) => {
    return (
        <div
            className={twMerge(
                "rounded-full w-6 h-6 bg-main text-yellow flex items-center justify-center p-1",
                className,
            )}
        >
            {children}
        </div>
    )
}

export default TagBadge
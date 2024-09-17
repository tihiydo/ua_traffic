import { Check, CheckCheck, type LucideProps } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge';

type Props = {
    isViewed: boolean;
    isMine: boolean;
    className?: string;
} & LucideProps

const ViewCheckmark = ({ isMine, isViewed, className, ...props }: Props) => {
    return (
        !isMine
            ? null
            : isViewed
                ? (
                    <CheckCheck className={twMerge(className)} size={16}  {...props} />
                )
                : (
                    <Check className={twMerge(className)} size={16}  {...props} />
                )
    )
}

export default ViewCheckmark
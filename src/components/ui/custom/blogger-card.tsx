import React from 'react'
import { Button, type ButtonProps } from '../button';
import { twMerge } from 'tailwind-merge';
import SpinnerLoading from './spinner-loading';
import { Bookmark } from 'lucide-react';
import {toast} from 'react-toastify';

type SaveBloggerButtonProps = {
    isLoading?: boolean;
    isSaved?: boolean;
} & ButtonProps

export const SaveBloggerButton = ({ isLoading, isSaved, className, ...props }: SaveBloggerButtonProps) => {
    return (
        <Button
            size={'icon'}
            variant={'outline'}
            className={twMerge(
                'text-gray-secondary border-gray-secondary  border-2',
                isSaved && 'border-yellow text-yellow ',
                isLoading && 'opacity-50 text-gray-secondary border-gray-secondary cursor-progress',
                className
            )}
            {...props}
        >
            {isLoading ? (
                <SpinnerLoading />
            ) : (
                <Bookmark size={20} className={`${isSaved ? 'fill-yellow' : ''}`} />
            )}
            <p className='sr-only'>Save</p>
        </Button>
    )
}

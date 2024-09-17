'use client'

import { Button, type ButtonProps } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import React, { useState } from 'react'
import SpinnerLoading from './ui/custom/spinner-loading';


type Props = Omit<{
    url: string;
    filename: string;
} & ButtonProps, 'onClick'>;

const DownloadButton = ({ filename, url, children, variant = 'outline', size = 'icon', ...props }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Button
            disabled={isLoading}
            variant={variant}
            size={size}
            onClick={() => {
                setIsLoading(true)
                fetch(url)
                    .then(res => res.blob())
                    .then((blob) => {
                        const a = document.createElement('a');

                        a.setAttribute('download', filename);
                        a.setAttribute('href', URL.createObjectURL(blob));
                        a.click();
                    })
                    .finally(() => setIsLoading(false))
            }}
            {...props}
        >
            {isLoading ? (
                <SpinnerLoading  />
            ) : (
                children ?? (
                    <DownloadIcon className='size-full' />
                )
            )}
        </Button>
    )
}

export default DownloadButton
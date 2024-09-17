'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import useTimeout from '@/hooks/use-timeout';
import { CheckIcon, CopyIcon } from 'lucide-react';
import React, { useState } from 'react'

type Props = Omit<ButtonProps & {
    text: string;
    timeout?: number;
}, 'onClick'>

const CopyButton = ({ text, timeout = 3000, children, variant = 'outline', size = 'icon', ...props }: Props) => {
    const [copiedResently, setCopiedResently] = useState(false);

    const { start } = useTimeout(() => {
        setCopiedResently(false)
    }, timeout)

    return (
        <Button
            size={size}
            variant={variant}
            onClick={() => {
                start();
                setCopiedResently(true)
                navigator.clipboard.writeText(text)
            }}
            {...props}
        >
            {copiedResently ? (
                <CheckIcon className='size-full' />
            ) : (
                children ?? (
                    <CopyIcon className='size-full' />
                )
            )}
        </Button>
    )
}

export default CopyButton
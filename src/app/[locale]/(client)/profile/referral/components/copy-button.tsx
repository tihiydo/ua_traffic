'use client'
import { Button, type ButtonProps } from '@/components/ui/button'
import useTimeout from '@/hooks/use-timeout';
import { CheckIcon, CopyIcon } from 'lucide-react';
import React, { useState } from 'react'

type Props = Omit<ButtonProps & {
    text: string;
}, 'onClick' | 'variant' | 'size'>

const CopyButton = ({ text }: Props) => {
    const [copiedResently, setCopiedResently] = useState(false);

    const { start } = useTimeout(() => {
        setCopiedResently(false)
    }, 3000)

    return (
        <Button
            size={'icon'}
            variant={'outline'}
            onClick={() => {
                start();
                setCopiedResently(true)
                navigator.clipboard.writeText(text)
            }}
        >
            {copiedResently ? (
                <CheckIcon />
            ) : (
                <CopyIcon />

            )}
        </Button>
    )
}

export default CopyButton
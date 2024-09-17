'use client';

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useErrorTranslate } from '@/hooks/use-error';
import { api } from '@/trpc/react'
import { type Chat } from '@prisma/client';
import { MessageCircleIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'react-toastify';

type Props = {
    requestId: string;
    onSuccess?: (chat: Chat) => void;
}

const CreateChatButton = ({ requestId, onSuccess }: Props) => {
    const translateError = useErrorTranslate();
    const { mutate, isLoading } = api.chat.createChat.useMutation({
        onSuccess: (chat) => {
            onSuccess?.(chat)
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });
    return (
        <Button
            onClick={() => mutate({ requestId })}
            disabled={isLoading}
        >
            {isLoading ? (
                <SpinnerLoading />
            ) : (
                <MessageCircleIcon />
            )}
        </Button>
    )
}

export default CreateChatButton
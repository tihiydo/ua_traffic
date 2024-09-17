'use client'

import TelegramCircleIcon from '@/components/icons/telegram-circle-icon'
import { api } from '@/trpc/react';
import React from 'react'
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { useEmulatorContext } from './emulator-context';
import Translate from '@/components/Translate';
import { useErrorTranslate } from '@/hooks/use-error';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useMediaTransform } from '../hooks/use-media-transform';
import { sanitizeHTML } from '@/utils/sanitize-html';
import { useTranslations } from 'next-intl';

type Props = {
    className?: string;
}

const SendMessageButton = ({ className }: Props) => {
    const messagesT = useTranslations('Messages')
    const translateError = useErrorTranslate();
    const { buttons, content, media, disabled } = useEmulatorContext();
    const parsedMedia = useMediaTransform(media);
    const sendMessage = api.advertisment.posts.sendTgPostPreview.useMutation({
        onError: (error) => {
            toast.error(translateError(error.message))
        },
        onSuccess: () => {
            toast.success(messagesT('tg-message-sent'))
        }
    });

    return (
        <button
            disabled={sendMessage.isLoading || disabled}
            onClick={async () => {
                const parsedContent = sanitizeHTML(content, ['strong', 'b', 'a', 'i', 's', 'em'])

                sendMessage.mutate({
                    // content: parsedContent,
                    content: parsedContent,
                    buttons: buttons.map(item => ({
                        link: item.href,
                        text: item.display,
                    })),
                    media: parsedMedia.map(item => ({
                        url: item.url,
                        type: item.type,
                        contentType: item.contentType,
                    })),
                });
            }}
            className={twMerge('w-full rounded-md  duration-150 transition-colors bg-[#179cde] hover:bg-[hsl(200,80%,52%)] flex items-center justify-center gap-2 text-white py-1.5 px-3 text-sm  ', (sendMessage.isLoading || disabled) ? 'opacity-70 hover:bg-[#179cde]' : '',  content.length === 0 && 'cursor-not-allowed' ,className)}
        >
            {sendMessage.isLoading ? (
                <SpinnerLoading className='w-6 h-6' />
            ) : (
                <>
                    <TelegramCircleIcon className='w-6 h-6 mr-2' />

                    <Translate namespace='Constructor' itemKey='telegram-send' />
                </>
            )}
        </button >
    )
}

export default SendMessageButton
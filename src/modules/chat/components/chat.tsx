'use client';

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sendMessage, validateMessage } from '../api/send-message';
import type { ChatState } from '../types';
import MessageForm from './message-form';
import MessagesContainer from './messages-container';

type Props = {
    chatState: ChatState;
    onClose?: () => void;
}

const Chat = ({ chatState, onClose }: Props) => {
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const { mutate: addWarn } = api.admin.chatRouter.addWarningMessage.useMutation()
    const [isSending, setIsSending] = useState(false);
    const [isOver, setIsOver] = useState(chatState.isOver);

    useEffect(() => {
        console.log('Chat state updated:', chatState);
        setIsOver(chatState.isOver);
    }, [chatState]);

    useEffect(() => {
        if (!lastMessageRef.current) return

        lastMessageRef.current.scrollIntoView({ behavior: "instant", block: 'nearest', inline: 'start' });
    }, [lastMessageRef])

    const handleSubmit = async ({ message }: { message: string }) => {
        if (!chatState.me) return;

        try {
            setIsSending(true);

            await sendMessage({
                chatId: chatState.chat.id,
                content: message,
                sender: {
                    id: chatState.me.id,
                    name: chatState.me.name ?? 'N/A',
                    role: chatState.me.role
                }
            });

            if (validateMessage({
                chatId: chatState.chat.id,
                content: message,
                sender: {
                    id: chatState.me.id,
                    name: chatState.me.name ?? 'N/A',
                    role: chatState.me.role
                }
            })) {
                addWarn({ content: message, chatId: chatState.chat.id });
            }

            lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const isAdminChat = chatState.chat.isAdminChat;

    return (
        <div className="w-full lg:max-w-[700px] relative rounded-lg border mx-auto border-gray-secondary">
            <div className="shadow-md h-[4rem] py-2 flex items-center">
                <div className=" px-4">
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => {
                            onClose?.();
                        }}
                        className="cursor-pointer"
                    >
                        <ChevronLeftIcon color="#a3a3a3" />
                    </Button>
                </div>

                <div className="flex flex-col pr-5">
                    <h5 className="font-bold text-sm md:text-base">
                        {isAdminChat
                            ? (chatState.chat.title || 'Chat with Admin')
                            : chatState.chat.AdvertismentRequest?.AdvertismentPost.title}
                    </h5>

                    {!!chatState.me && (
                        <p className='text-xs md:text-sm'>
                            {isAdminChat
                                ? (chatState.me.role === 'admin' ? 'Чат з Юзером' : <Translate namespace='Default' itemKey='ChatWithAdmin' />)
                                : (chatState.me.role === 'admin'
                                    ? `${chatState.chat.AdvertismentRequest?.AdvertismentPost.Creator.email} - @${chatState.chat.AdvertismentRequest?.Blogger.username}`
                                    : chatState.me.role === 'blogger'
                                        ? chatState.chat.AdvertismentRequest?.AdvertismentPost.Creator.email
                                        : `@${chatState.chat.AdvertismentRequest?.Blogger.username}`
                                )
                            }
                        </p>
                    )}
                </div>
            </div>
            <div className='px-2 sm:px-3 md:px-7 lg:px-10 mb-3 md:mb-5 lg:mb-7'>
                <MessagesContainer ref={lastMessageRef} chatState={chatState} />

                {(chatState.me?.role !== 'admin' && !isOver) || isAdminChat ? (
                    <MessageForm
                        isLoading={isSending}
                        onSubmit={handleSubmit}
                    />
                ) : null}

                {isOver && !isAdminChat && (
                    <div className='text-center mt-5 w-full bg-gray py-5 rounded-md'>
                        <Translate namespace='Chat' itemKey='chat-over' />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat;
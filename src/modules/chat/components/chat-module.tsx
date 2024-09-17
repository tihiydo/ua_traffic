import Translate from '@/components/Translate';
import { useRouter } from '@/i18n/navigation';
import { MessagesSquareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useChatParams } from '../hooks/use-chat-params';
import { useChats } from '../hooks/use-chats';
import type { Chat as ChatType } from '../types';
import Chat from './chat';
import ChatsList from './chats-list';

type Props = {
    chats: ChatType[];
    isLoading?: boolean;
}

const ChatModule = ({ chats, isLoading }: Props) => {
    const stateChats = useChats(chats);
    const router = useRouter();
    const { schemaParams, remove, update } = useChatParams();
    const [selectedChat, setSelectedChat] = useState<Maybe<string>>(null);

    const selectedChatState = Object.values(stateChats).find(({ chat }) => chat.id === selectedChat);

    useEffect(() => {
        if (!schemaParams.chat || selectedChat) return;
        if(selectedChatState?.me) {
if (selectedChatState?.me?.role === 'unauthorized') {
        router.replace('/')
    }
        }
        setSelectedChat(
            chats.find((chat) => chat.id === schemaParams.chat)?.id
        )
    }, [chats, schemaParams.chat, selectedChat, selectedChatState?.me])

    

    return (
        <div className={twMerge("flex lg:flex-row flex-col gap-8 ", !selectedChat && 'items-center h-full justify-center')} >
            <ChatsList
                selectedChat={selectedChat}
                isLoading={isLoading}
                stateChats={Object.values(stateChats)}
                onSelect={(chat) => {
                    update('chat', chat.chat.id)
                    setSelectedChat(chat.chat.id)
                }}
            />

            <div className={"flex-1 "}>
                {
                    selectedChatState ? (
                        <Chat
                            chatState={selectedChatState}
                            onClose={() => {
                                remove('chat')
                                setSelectedChat(null)
                            }}
                        />
                    ) : (
                        <div className='flex flex-col items-center justify-center'>
                            <MessagesSquareIcon className='text-yellow' size={150} />

                            <p className='font-bold text-base md:text-lg mt-3'>
                                <Translate namespace='Chat' itemKey='pick-chat' />
                            </p>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default ChatModule
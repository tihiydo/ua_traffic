import { twMerge } from 'tailwind-merge';
import type { ChatState } from '../types';
import Translate from '@/components/Translate';
import MessageDate from './message-date';
import ViewCheckmark from './view-checkmark';

type Props = {
    index: number;
    chatState: ChatState;
    isSelected?: boolean;
    onClick?: (chat: ChatState) => void;
    isAdminChat?: boolean;
}

const ChatCard = ({ chatState, onClick, index, isSelected, isAdminChat }: Props) => {
    const unviewedMessagesCount = chatState.me ? chatState.messages.filter(message => (
        !message.viewedBy.includes(chatState.me?.id ?? '') && message.sender.id !== chatState.me?.id
    )).length : 0

    const getChatTitle = () => {
        if (isAdminChat) {
            return chatState.chat.title || 'Admin Chat';
        }
        return chatState.chat.AdvertismentRequest?.AdvertismentPost.title || 'ADMIN';
    }

    const getChatSubtitle = () => {
        if (isAdminChat) {
            return <Translate namespace='Default' itemKey='AdminSupport' />;
        }
        if (chatState.me?.role === 'admin') {
            return `${chatState.chat.AdvertismentRequest?.AdvertismentPost.Creator.email} - @${chatState.chat.AdvertismentRequest?.Blogger.username}`;
        }
        if (chatState.me?.role === 'blogger') {
            return chatState.chat.AdvertismentRequest?.AdvertismentPost.Creator.email;
        }
        return `@${chatState.chat.AdvertismentRequest?.Blogger.username}`;
    }

    return (
        <li
            className={twMerge(
                "w-full flex justify-between  h-[8rem] border-gray-secondary p-4 cursor-pointer gap-3 bg-white hover:bg-gray/80 duration-100",
                index !== 0 && 'border-t',
                chatState.isOver && 'opacity-50',
                isSelected && 'bg-gray/70',
                isAdminChat && 'opacity-100'
            )}
            onClick={() => {
                onClick?.(chatState)
            }}
        >
            <div className='flex-1'>
                <h3 className="font-bold text-sm md:text-base">
                    {getChatTitle()}
                </h3>

                <div className='text-xs md:text-sm'>{getChatSubtitle()}</div>

                {!!chatState.lastMessage && (
                    <p className="mt-2 text-gray-last break-words line-clamp-2 text-sm alg:text-base break-all">
                        {chatState.lastMessage?.sender.id === chatState.me?.id
                            ? <Translate namespace='Chat' itemKey='me' />
                            : chatState.lastMessage?.sender.name}: {" "}
                        {chatState.lastMessage?.content}
                    </p>
                )}
            </div>

            <div className='relative'>
                {!!chatState.lastMessage && (
                    <div className='text-gray-secondary flex items-center gap-1'>
                        {chatState.me?.role !== 'admin' && (
                            <ViewCheckmark
                                strokeWidth={2.5}
                                className='text-gray-secondary'
                                isMine={chatState.lastMessage.sender.id === chatState.me?.id}
                                isViewed={chatState.lastMessage.viewedBy.some(viewer => viewer !== chatState.me?.id)}
                            />
                        )}

                        <MessageDate timestamp={chatState.lastMessage.createdAt} className=' text-xs' withTooltip={false} />
                    </div>
                )}

                {chatState.me?.role !== 'admin' && unviewedMessagesCount > 0 && (
                    <div className='bg-gray-secondary rounded-full p-2 text-white text-sm flex items-center justify-center w-8 h-8 absolute right-0 top-1/2 -translate-y-1/2'>
                        {unviewedMessagesCount}
                    </div>
                )}
            </div>
        </li>
    )
}

export default ChatCard
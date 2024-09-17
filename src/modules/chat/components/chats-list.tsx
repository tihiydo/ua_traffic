import SearchInput from "@/components/search-input";
import Translate from "@/components/Translate";
import { Skeleton } from "@/components/ui/skeleton";
import ChatCard from "@/modules/chat/components/chat-card";
import { MessageSquareDashedIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ChatState, RealtimeChat } from "../types";

type Props = {
    isLoading?: boolean;
    stateChats: ChatState[];
    selectedChat?: Maybe<string>;
    onSelect?: (chat: RealtimeChat) => void;
    hideSearch?: boolean;
    className?: string;
}



const ChatsList = ({ stateChats, onSelect, isLoading, selectedChat, hideSearch, className }: Props) => {

    console.log('XHAT kust', stateChats)
    const [search, setSearch] = useState<string>('')
    const filteredChats = useMemo(() => {
        if (!search) return stateChats; 
          
        return stateChats.filter(({ chat }) => chat?.AdvertismentRequest?.AdvertismentPost.title.includes(search))
    }, [stateChats, search])

    console.log('stateChats', stateChats)

    return (
        <div className={twMerge( "lg:w-[386px] w-full", !!selectedChat && 'hidden lg:block', className)}>
            {!hideSearch && (
                <div>
                    <SearchInput onChange={setSearch} />
                </div>
            )}
            <div className={`mt-5`}>
                <ul className={twMerge("border border-gray-secondary rounded-lg overflow-hidden", (!isLoading && !filteredChats.length) && 'border-transparent')}>
                    {isLoading ? (
                        Array(3).fill(null).map((_, index) => (
                            <li key={index} className={twMerge("w-full h-[8rem] border-gray-secondary p-4 mb-2", index !== 0 && 'border-t')} >
                                <Skeleton className="h-4 w-[60%]" />
                                <Skeleton className="h-3 w-[50%] mt-3" />

                                <div className="mt-5 flex gap-2">
                                    <Skeleton className="h-3 w-[15%]" />
                                    <Skeleton className="h-3 w-[50%]" />
                                </div>
                                <Skeleton className="h-3 w-[40%] mt-1" />
                            </li>
                        ))
                    ) : (
                        filteredChats.length
                            ? filteredChats.map((chatState, index) => (
                                <ChatCard
                                    key={chatState.chat.id}
                                    isAdminChat={chatState.chat.isAdminChat}
                                    index={index}
                                    isSelected={selectedChat === chatState.chat.id}
                                    chatState={chatState}
                                    onClick={(chat) => {
                                        onSelect?.(chat)
                                    }}
                                />
                            ))
                            : (
                                <div className="py-3 px-5 flex justify-center items-center gap-3">
                                    <MessageSquareDashedIcon className="text-yellow" size={35} />

                                    <Translate namespace="Chat" itemKey="not-found-chats" />
                                </div>
                            )
                    )}
                </ul>
            </div>
        </div >
    )
}

export default ChatsList
import React, { forwardRef, useEffect, useState } from 'react'
import { type MessageType } from '../types/message'
import { ScrollArea } from '@/components/ui/scroll-area'
import Message from './message'
import { useDebounce } from '@/hooks/use-debounce'
import { viewMessages } from '../api/view-messages-until'
import type { ChatState } from '../types'


type Props = {
    chatState: ChatState;
}

const MessagesContainer = forwardRef<HTMLDivElement, Props>(({ chatState }, ref) => {
    const [viewedMessages, setViewedMessages] = useState<MessageType[]>([]);
    const debouncedViewedMessages = useDebounce(viewedMessages, 1000);


    const addViewedMessage = (message: MessageType) => {
        setViewedMessages([...viewedMessages, message])
    }

    useEffect(() => {
        if (!debouncedViewedMessages.length || !chatState.me) return;

        const lastViewed = [...debouncedViewedMessages].sort((a, b) => b.createdAt - a.createdAt)[0];
        if (!lastViewed) return;

        viewMessages(
            chatState.messages.filter(message => message.createdAt <= lastViewed.createdAt),
            chatState.me.id
        )
    }, [debouncedViewedMessages]);

    return (
        <ScrollArea className="h-[500px] md:pr-5 my-2" >
            {
                chatState.messages?.map((message) => (
                    <Message
                        key={message.id}
                        chatState={chatState}
                        message={message}
                        onViewed={(message) => {
                            if (!chatState.me || chatState.me.role === 'admin') return;

                            if (message.sender.id === chatState.me.id || message.viewedBy.includes(chatState.me.id)) return;

                            addViewedMessage(message);
                        }}
                    />
                ))
            }

            <div style={{ float: "left", clear: "both" }}
                ref={ref}>
            </div>
        </ScrollArea >
    )
})

MessagesContainer.displayName = 'MessagesContainer'

export default MessagesContainer
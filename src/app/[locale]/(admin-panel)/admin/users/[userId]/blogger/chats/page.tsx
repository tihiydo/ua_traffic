'use client'

import { api } from "@/trpc/react"
import {ChatModule } from "@/modules/chat"

type Props = 
{
    params:
    {
        userId: string
    }
}

function ChatsPage(props: Props) {
    const { data: chats = [], isLoading } = api.chat.getBloggerChats.useQuery({userId: props.params.userId}, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <div>
            <ChatModule chats={chats} isLoading={isLoading} />
        </div>)
}

export default ChatsPage
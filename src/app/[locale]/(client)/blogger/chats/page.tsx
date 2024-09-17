'use client'

import { api } from "@/trpc/react"
import { ChatModule } from "@/modules/chat"
import Translate from '@/components/Translate';

function ChatsPage() {
    const { data: chats = [], isLoading } = api.chat.getBloggerChats.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    console.log('Chats:', chats);

    return (

        <div>
            <h1 className="text-[30px] leading-[35px] font-bold mb-4">
                <Translate namespace="Advertiser" itemKey="chats" />
            </h1>
            <ChatModule chats={chats} isLoading={isLoading} />
        </div>
    )
}

export default ChatsPage
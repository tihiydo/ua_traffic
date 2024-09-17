'use client'

import PageTitle from '@/components/page-title'
import { ChatModule } from '@/modules/chat'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent } from '@/components/ui/custom/custom-tabs'

const ChatsPage = () => {
    const { data: chats, isLoading } = api.admin.chatRouter.getChatsList.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: warningMessages, isLoading: warningMessagesLoading } = api.admin.chatRouter.getWarningChats.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: chatsWithAdmin, isLoading: chatsWithAdminLoading } = api.admin.chatRouter.chatsWithAdmin.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });

    const [activeTab, setActiveTab] = useState<'all' | 'warning' | 'adminChats'>('all');

    return (
        <div>
            <div className='mb-4'>
                <div className="mb-5">
                    <PageTitle>Чати</PageTitle>
                </div>
                <CustomTabs
                    defaultValue={activeTab}
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as 'all' | 'warning' | 'adminChats')}
                >
                    <CustomTabsList className={"mb-3 gap-4"}>
                        <CustomTabsTrigger value="all">Усі чати</CustomTabsTrigger>
                        <CustomTabsTrigger value="warning">Обхідні чати</CustomTabsTrigger>
                        <CustomTabsTrigger value="adminChats">Чати підтримки</CustomTabsTrigger>
                    </CustomTabsList>

                    <CustomTabsContent value="all">
                        <ChatModule chats={chats ?? []} isLoading={isLoading} />
                    </CustomTabsContent>

                    <CustomTabsContent value="warning">
                        <ChatModule chats={warningMessages?.map(wMes => wMes.Chat) ?? []} isLoading={warningMessagesLoading} />
                    </CustomTabsContent>
                    <CustomTabsContent value="adminChats">
                        <ChatModule chats={chatsWithAdmin ?? []} isLoading={chatsWithAdminLoading} />
                    </CustomTabsContent>
                </CustomTabs>
            </div>
        </div>
    )
}

export default ChatsPage
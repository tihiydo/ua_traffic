'use client'

import PageTitle from '@/components/page-title'
import { Button } from '@/components/ui/button'
import { ChatModule } from '@/modules/chat'
import { api } from '@/trpc/react'
import Link from 'next/link'
import React from 'react'

const WarningMessagesPage = () => {
    const { data: warningMessages, isLoading } = api.admin.chatRouter.getWarningChats.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
    console.log(warningMessages)

    return (
        <div>
            <div className="mb-5">
                    <PageTitle>Обхідні Чати</PageTitle>
                </div>
            <div className='mb-4'>
                <Link href="/admin/chatlist">
                    <Button>Повернутись до усіх чатів</Button>
                </Link>
            </div>
            <ChatModule chats={warningMessages?.map(wMes => wMes.Chat) ?? []} isLoading={isLoading}  />
        </div>
    )
}

export default WarningMessagesPage
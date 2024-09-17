import React from 'react'
import Table from './_components/table/table'
import { InstagramContent, SocialTabs, TelegramContent } from '@/components/social-tabs'


const BloggerModerationPage = () => {

    return (
        <div className='relative'>
            <SocialTabs>
                <InstagramContent>
                    <Table socialType="Instagram"/>
                </InstagramContent>

                <TelegramContent>
                    <Table socialType="Telegram"/>
                </TelegramContent>
            </SocialTabs>
        </div>
    )
}

export default BloggerModerationPage
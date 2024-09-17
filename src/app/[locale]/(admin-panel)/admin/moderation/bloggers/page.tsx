import React from 'react'
import Table from './_components/table/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { InstagramContent, SocialTabs, TelegramContent } from '@/components/social-tabs'


const BloggerModerationPage = () => {

    return (
        <div className='relative'>
            <Button className="sm:absolute right-0 top-[-65px] mb-4 sm:w-fit w-full sm:mb-0">
                <Link href={"/admin/new-channel"}>Створити канал </Link>
            </Button>
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
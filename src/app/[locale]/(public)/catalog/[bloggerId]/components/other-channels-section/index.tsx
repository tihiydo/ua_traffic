'use client'

import Swiper from '@/components/swiper/swiper'
import React, { useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import SwiperBloggerCard from './swiper-blogger-card'
import { type CatalogBlogger } from '@/types/enities/blogger'
import { CustomTabs, CustomTabsContent, CustomTabsList, CustomTabsTrigger } from '@/components/ui/custom/custom-tabs'
import SocialIcon from '@/components/ui/social-icon'

type Props = {
    channels: CatalogBlogger[]
}

const BloggerChannelsSwiper = ({ channels }: Props) => {
    const [activeTab, setActiveTab] = useState<'Instagram' | 'Telegram'>('Instagram')

    const instagramChannels = channels.filter(channel => channel.type === 'Instagram')
    const telegramChannels = channels.filter(channel => channel.type === 'Telegram')

    const hasInstagramChannels = instagramChannels.length > 0
    const hasTelegramChannels = telegramChannels.length > 0

    return (
        <CustomTabs defaultValue={hasInstagramChannels ? "Instagram" : "Telegram"} onValueChange={(value) => setActiveTab(value as 'Instagram' | 'Telegram')}>
            <CustomTabsList className={"mb-3 gap-3"}>
                {hasInstagramChannels && (
                    <CustomTabsTrigger value="Instagram">
                        <SocialIcon social='Instagram' className='w-6' />
                        <p className="font-title uppercase">Instagram</p>
                    </CustomTabsTrigger>
                )}
                {hasTelegramChannels && (
                    <CustomTabsTrigger value="Telegram">
                        <SocialIcon social='Telegram' className='w-6' />
                        <p className="font-title uppercase">Telegram</p>
                    </CustomTabsTrigger>
                )}
            </CustomTabsList>

            {hasInstagramChannels && (
                <CustomTabsContent value="Instagram">
                    <Swiper>
                        {instagramChannels.map(channel => (
                            <SwiperSlide key={channel.id}>
                                <SwiperBloggerCard blogger={channel} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </CustomTabsContent>
            )}

            {hasTelegramChannels && (
                <CustomTabsContent value="Telegram">
                    <Swiper>
                        {telegramChannels.map(channel => (
                            <SwiperSlide key={channel.id}>
                                <SwiperBloggerCard blogger={channel} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </CustomTabsContent>
            )}
        </CustomTabs>
    )
}

export default BloggerChannelsSwiper

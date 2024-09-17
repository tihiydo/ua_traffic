import React from 'react'
import InstagramTab from './(instagram)/instagram-tab'
import TelegramTab from './(telegram)/telegram-tab';
import { InstagramContent, SocialTabs, TelegramContent } from '@/components/social-tabs';
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import Translate from '@/components/Translate';

export async function generateMetadata(): Promise<Metadata> {
    const advertiserNewPostT = await getTranslations('Advertiser.New-Post-Page');

    return {
        title: "UATRAFFIC | " + advertiserNewPostT('meta/title'),
        description: advertiserNewPostT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + advertiserNewPostT('meta/title'),
            description: advertiserNewPostT('meta/description'),
        },
    }
}

const NewPostPage = async () => {

    return (
        <>
            <h1 className="text-[30px] leading-[35px] font-bold mb-4">
                <Translate namespace="Advertiser" itemKey="newshortpost" />
            </h1>
            <SocialTabs>
                <InstagramContent>
                    <InstagramTab />
                </InstagramContent>

                <TelegramContent>
                    <TelegramTab />
                </TelegramContent>
            </SocialTabs>
        </>
    )

}

export default NewPostPage
import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const advertiserChatsPage = await getTranslations('Advertiser.Chats-Page');

    return {
        title: "UATRAFFIC | " + advertiserChatsPage('meta/title'),
        description: advertiserChatsPage('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + advertiserChatsPage('meta/title'),
            description: advertiserChatsPage('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode
}

const AdvertiserChatsLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default AdvertiserChatsLayout
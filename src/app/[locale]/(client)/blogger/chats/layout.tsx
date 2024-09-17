import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const bloggerChatsPage = await getTranslations('Blogger.Chats-Page');

    return {
        title: "UATRAFFIC | " + bloggerChatsPage('meta/title'),
        description: bloggerChatsPage('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + bloggerChatsPage('meta/title'),
            description: bloggerChatsPage('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode
}

const BloggerChatsLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default BloggerChatsLayout
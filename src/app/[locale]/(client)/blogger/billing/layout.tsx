import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const bloggerRevenuePage = await getTranslations('Blogger.Revenue-Page');

    return {
        title: "UATRAFFIC | " + bloggerRevenuePage('meta/title'),
        description: bloggerRevenuePage('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + bloggerRevenuePage('meta/title'),
            description: bloggerRevenuePage('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode
}

const BloggerBillingLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default BloggerBillingLayout
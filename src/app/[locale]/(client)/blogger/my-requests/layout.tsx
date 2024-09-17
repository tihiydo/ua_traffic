import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import MyRequestsPage from './page';

export async function generateMetadata(): Promise<Metadata> {
    const bloggerRequestsT = await getTranslations('Blogger.Requests-Page');

    return {
        title: "UATRAFFIC | " + bloggerRequestsT('meta/title'),
        description: bloggerRequestsT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + bloggerRequestsT('meta/title'),
            description: bloggerRequestsT('meta/description'),
        },
    }
}
type Props = {
    children: React.ReactNode;
};
const LayoutRequestsPage = async (props: Props) => {
    return (<>
        {props.children}
    </>)
}

export default LayoutRequestsPage
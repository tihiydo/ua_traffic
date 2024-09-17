
import Table from './_components/table'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const bloggerChannelsT = await getTranslations('Blogger.Channels-Page');

    return {
        title: "UATRAFFIC | " + bloggerChannelsT('meta/title'),
        description: bloggerChannelsT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + bloggerChannelsT('meta/title'),
            description: bloggerChannelsT('meta/description'),
        },
    }
}

async function MyChannelsPage() {

    return (
        <>
            <Table />
        </>

    )
}

export default MyChannelsPage
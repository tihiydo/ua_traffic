import Table from "./_components/table"
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const advertiserPostsT = await getTranslations('Advertiser.Posts-Page');

    return {
        title: "UATRAFFIC | " + advertiserPostsT('meta/title'),
        description: advertiserPostsT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + advertiserPostsT('meta/title'),
            description: advertiserPostsT('meta/description'),
        },
    }
}

const MyPostsPage = async () => {
    return (
        <Table />
    )
}

export default MyPostsPage
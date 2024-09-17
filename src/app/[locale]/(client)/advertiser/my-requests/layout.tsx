import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import MyRequestsPage from "./page";

export async function generateMetadata(): Promise<Metadata> {
    const advertiserRequestsT = await getTranslations('Advertiser.Requests-Page');

    return {
        title: "UATRAFFIC | " + advertiserRequestsT('meta/title'),
        description: advertiserRequestsT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + advertiserRequestsT('meta/title'),
            description: advertiserRequestsT('meta/description'),
        },
    }
}
type Props = {
    children: React.ReactNode;
};
const LayoutRequestsPage = async (props: Props) => {
    return (<>
        {props.children}
    </>
    )
}

export default LayoutRequestsPage
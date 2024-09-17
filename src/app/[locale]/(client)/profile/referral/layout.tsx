import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const profileReferralT = await getTranslations('Profile.Referral');

    return {
        title: "UATRAFFIC | " + profileReferralT('meta/title'),
        description: profileReferralT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + profileReferralT('meta/title'),
            description: profileReferralT('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode;
}

const RefferalSystemLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default RefferalSystemLayout
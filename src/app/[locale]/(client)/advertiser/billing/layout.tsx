import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const advertiserBillingT = await getTranslations('Advertiser.Payments-Page');

    return {
        title: "UATRAFFIC | " + advertiserBillingT('meta/title'),
        description: advertiserBillingT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + advertiserBillingT('meta/title'),
            description: advertiserBillingT('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode
}

const AdvertiserBillingLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default AdvertiserBillingLayout
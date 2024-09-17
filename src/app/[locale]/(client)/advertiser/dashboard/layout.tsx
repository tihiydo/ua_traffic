import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const dashboardPage = await getTranslations('Advertiser.Dashboard-Page');

    return {
        title: "UATRAFFIC | " + dashboardPage('meta/title'),
        description: dashboardPage('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + dashboardPage('meta/title'),
            description: dashboardPage('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default DashboardLayout
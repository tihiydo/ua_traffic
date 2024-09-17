import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const authTwoFAT = await getTranslations('Auth.TwoFA');

    return {
        title: "UATRAFFIC | " + authTwoFAT('meta/title'),
        description: authTwoFAT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authTwoFAT('meta/title'),
            description: authTwoFAT('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode
}

const TwoFALayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default TwoFALayout
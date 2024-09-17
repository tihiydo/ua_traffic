import React from 'react'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const authUserVerifyT = await getTranslations('Auth.User-Verify');

    return {
        title: "UATRAFFIC | " + authUserVerifyT('meta/title'),
        description: authUserVerifyT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authUserVerifyT('meta/title'),
            description: authUserVerifyT('meta/description'),
        },
    }
}
type Props = {
    children: React.ReactNode
}

const UserVerifyLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default UserVerifyLayout
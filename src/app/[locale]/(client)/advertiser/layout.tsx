import PageTitle from "@/components/page-title";
import React from "react";
import AdvertiserNavBar from "./_components/advertiser-nav-bar";
import AdvertiserSidebar from "./_components/advertiser-sidebar";
import Translate from "@/components/Translate";
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const advertiserT = await getTranslations('Advertiser');

    return {
        title: "UATRAFFIC | " + advertiserT('meta/title'),
        description: advertiserT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + advertiserT('meta/title'),
            description: advertiserT('meta/description'),
        },
    }
}

type Props = {
    children: React.ReactNode;
};

const AdvertiserLayout = ({ children }: Props) => {
    return (
        <div className="flex h-screen">
            <div className="hidden lg:block">
                <AdvertiserSidebar />
            </div>
            <div className="flex-1 overflow-x-hidden flex flex-col">
                <div className="flex-1 p-4 lg:mb-[54px] lg:ml-[25px] lg:mr-[25px] max-w-full">
                    <div className="mb-4">
                    </div>
                    <div className="lg:hidden mb-4">
                        <AdvertiserNavBar />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdvertiserLayout;
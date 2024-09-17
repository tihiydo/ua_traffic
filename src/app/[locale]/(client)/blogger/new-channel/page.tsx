import HowItWorks from "./_components/how-it-works";
import InstagramTab from "./_components/tabs/instagram/instagram-tab";
import TelegramTab from "./_components/tabs/telegram/telegram-tab";
import {
    SocialTabs,
    InstagramContent,
    TelegramContent,
} from "@/components/social-tabs";
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { useTranslations } from "next-intl";
import Translate from '@/components/Translate';

export async function generateMetadata(): Promise<Metadata> {
    const bloggerNewChannelT = await getTranslations("Blogger.New-Channel-Page");

    return {
        title: "UATRAFFIC | " + bloggerNewChannelT("meta/title"),
        description: bloggerNewChannelT("meta/description"),
        openGraph: {
            title: "UATRAFFIC | " + bloggerNewChannelT("meta/title"),
            description: bloggerNewChannelT("meta/description"),
        },
    };
}

const NewChannelPage = () => {

    const bloggerNewChannelT = useTranslations("Blogger.New-Channel-Page");

    return (
        <div className="min-h-[87vh]">
            <h1 className="text-[30px] leading-[35px] font-bold mb-4">
                <Translate namespace="Blogger" itemKey="addchannel" />
            </h1>
            <SocialTabs>
                <InstagramContent className="relative">
                    <InstagramTab />
                    <HowItWorks
                        className="hidden select-text md:block"
                        text={bloggerNewChannelT("how-it-works-inst")}
                    />
                </InstagramContent>

                <TelegramContent className="relative">
                    <TelegramTab />
                    <HowItWorks
                        className="hidden select-text md:block"
                        text={bloggerNewChannelT("how-it-works-tg")}
                    />
                </TelegramContent>
            </SocialTabs>
        </div>
    );
};

export default NewChannelPage;

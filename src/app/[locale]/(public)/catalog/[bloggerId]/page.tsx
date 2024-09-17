import { api } from "@/trpc/server";
import BloggerDescription from "./components/blogger-description";
import GoBackLink from "@/components/go-back-link";
import Translate from "@/components/Translate";
import BloggerChannelsSwiper from "./components/other-channels-section";
import { type Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { env } from "@/env.mjs";
import StatisticSection from "./components/statistic-section";
import MainCard from "./components/main-card";
import BloggerInfoSection from './components/BloggerInfoSection';
import BloggerReviews from './components/bloggerReviews';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Clock } from 'lucide-react';
import SwiperCardItem from './components/other-channels-section/swiper-card-item';
import Image from 'next/image';
import instagramIcon from "@/assets/icons/instagram.svg";
import telegramIcon from "@/assets/icons/telegram.svg";
import PageTitle from '@/components/page-title';


export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale });

    const blogger = await api.opengraph.getBloggerPublicView.query({ bloggerId: params.bloggerId })

    const description = t(
        'Public-View.meta/description',
        {
            followersCount: blogger?.followersCount,
            channelName: blogger?.username,
            socialNetwork: blogger?.type,
        }
    )

    return {
        title: 'UATRAFFIC | ' + t('Public-View.meta/title', { channel: blogger?.username ?? '' }),
        description: description,
        openGraph: {
            type: 'website',
            title: t('Public-View.meta/title', { channel: blogger?.username ?? '' }),
            description: description,
            url: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/catalog/${params.bloggerId}`,
            siteName: 'UATRAFFIC'
        }
    }
}

type Props = {
    params: {
        bloggerId: string;
        locale: string;
    };
};


const PublicBloggerPage = async ({ params }: Props) => {

    const tt = await getTranslations()

    unstable_setRequestLocale(params.locale)
    const { blogger, otherChannels } = await api.blogger.getBloggerPublicView.query({
        bloggerId: params.bloggerId,
    });


    const averageAcceptanceTime = await api.blogger.getAverageAcceptanceTime.query({
        bloggerId: params.bloggerId,
    });


    
    const showStatistic: boolean =
        blogger.type === 'Instagram'
            ? (blogger.statistic.followers?.length ?? 0) > 1
            : blogger.type === 'Telegram'
                ? (blogger.statistic.followers?.length ?? 0) > 1 || (blogger.statistic.coverage?.length ?? 0) > 1
                : false
    console.log('Average Acceptance Time:', averageAcceptanceTime);

    const iconSrc = blogger.type === 'Instagram' ? instagramIcon : telegramIcon;
    const showInfoSection = blogger.prices ||
                            blogger.womenPercentage ||
                            blogger.menPercentage ||
                            blogger.ageCategory ||
                            blogger.cpm ||
                            blogger.cpv ||
                            blogger.channelAge;


    return (
        <div>
            <div className='my-[50px]'>
                <PageTitle>{blogger.username}</PageTitle>
            </div>
            <GoBackLink fallbackLink='/catalog' className="mb-8" />
            <div className="flex gap-2 mb-4">
                <Image src={iconSrc} alt={blogger.type} width={24} height={24} />
                <h1 className="font-title uppercase justify-center whitespace-nowrap rounded-sm p-0 text-sm disabled:pointer-events-none px-0.5 py-0.5">{blogger.type}</h1>
            </div>
            <div className="grid grid-cols-1 gap-y-5 md:grid-cols-5">
                <section className="flex justify-center md:justify-start items-start h-fit mr-0 md:mr-5 col-span-full md:col-span-2">
                    <MainCard blogger={blogger} />
                </section>

                <div className="col-span-full md:col-span-3">
                    {showStatistic && (
                        <section className="mb-8">
                            <StatisticSection blogger={blogger} />
                        </section>
                    )}

                   
                    
                    {showInfoSection && (
                        <BloggerInfoSection
                            prices={blogger.prices}
                            womenPercentage={blogger.womenPercentage}
                            menPercentage={blogger.menPercentage}
                            ageCategory={blogger.ageCategory}
                            cpm={blogger.cpm}
                            cpv={blogger.cpv}
                            channelAge={blogger.channelAge}
                            tooltips={{
                                ageCategory: tt('Blogger.tooltipsAgeCategory', { ageCategory: blogger.ageCategory }),
                                channelAge: tt('Blogger.tooltipsChannelAge', { channelAge: blogger.channelAge }),
                                cpmCpv: tt('Blogger.tooltipsCpmCpv', { cpm: blogger.cpm, cpv: blogger.cpv })
                            }}
                        />
                    )}

                    {averageAcceptanceTime !== null && (
                        <Card className='md:max-w-[400px] w-full mb-4'>
                            <CardContent className="p-4">
                                <SwiperCardItem
                                    icon={<Clock size={30} />}
                                    content={
                                        <div className="flex gap-1.5 flex-col">
                                            <h5 className="font-bold whitespace-nowrap">
                                                <Translate namespace='Blogger' itemKey="averageAccTime" />
                                            </h5>
                                            <p>{Math.round(averageAcceptanceTime / 60000)} <Translate namespace="Catalogue" itemKey="timeMin" /></p>
                                        </div>
                                    }
                                />
                            </CardContent>
                        </Card>
                    )}


                    <BloggerDescription className='mt-8' about={blogger.about} />
                    {blogger.reviews.length > 0 && 
      <BloggerReviews className='mt-8' reviews={blogger.reviews} />
                    }
                </div>
            </div>

            {otherChannels.length ? (
                <div className="mt-8">
                    <h3 className="mb-5 font-title text-xl">
                        <Translate namespace="Catalogue" itemKey="other-channels" />
                    </h3>

                    <BloggerChannelsSwiper channels={otherChannels} />
                </div>
            ) : null}
        </div>
    
    )
}

export default PublicBloggerPage
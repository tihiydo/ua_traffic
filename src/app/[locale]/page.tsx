import Image from "next/image";
import mainHeader from "@/assets/images/header.png";
import advCabinet from "@/assets/images/advcabinet-example.png";
import { Button } from "@/components/ui/button";
import { Footer } from "./_components/footer";
import { Header } from "@/components/header";
import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import { getServerAuthSession } from "@/server/auth";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { type ResolvingMetadata, type Metadata } from "next";
import { env } from "@/env.mjs";
import BloggersSection from "./_components/bloggers-section";
import "swiper/css";
import { BoxesIcon, FileCheckIcon, ShieldCheckIcon } from "lucide-react";
import RatingBloggerSection from './_components/bloggers-section/blogger-rating-section';


export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale });

    const previousImages = (await parent).openGraph?.images || []

    return {
        title: 'UATRAFFIC | ' + t('Landing.meta/title'),
        description: t('Landing.meta/description'),
        openGraph: {
            type: 'website',
            title: 'UATRAFFIC | ' + t('Landing.meta/title'),
            description: t('Landing.meta/description'),
            url: `${env.NEXT_PUBLIC_SITE_URL}`,
            siteName: 'UATRAFFIC',
            images: [...previousImages]
        }
    }
}

type Props = {
    params: { locale: string }
}

export default async function HomePage({ params }: Props) {
    unstable_setRequestLocale(params.locale);
    const session = await getServerAuthSession();

    const Steps = [
        {
            id: 1,
            title: <Translate namespace="Landing" itemKey="bbl1" />,
            descr: <Translate namespace="Landing" itemKey="bbl1descr" />
        },
        {
            id: 2,
            title: <Translate namespace="Landing" itemKey="bbl2" />,
            descr: <Translate namespace="Landing" itemKey="bbl2descr" />
        },
        {
            id: 3,
            title: <Translate namespace="Landing" itemKey="bbl3" />,
            descr: <Translate namespace="Landing" itemKey="bbl3descr" />
        },
        {
            id: 4,
            title: <Translate namespace="Landing" itemKey="bbl4" />,
            descr: <Translate namespace="Landing" itemKey="bbl4descr" />
        }
    ]

    return (
        <>
            <Header />
            <div className="container">
                <div className="relative flex h-full rounded-md mb-32 my-4">
                    <div className="relative w-full h-[568px] md:min-h-[568px]">
                        <Image
                            loading="lazy"
                            quality={100}
                            src={mainHeader}
                            alt={`${<Translate namespace="Landing" itemKey="title" />}`}
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <div className="absolute left-1/2 md:left-[3%] top-1/2 transform -translate-x-1/2 md:-translate-x-0 -translate-y-1/2 container flex aspect-square mx-auto w-[90%] md:w-[60%] h-[50%] flex-col justify-center overflow-hidden rounded-md backdrop-blur-md bg-black/30">
                        <div className="relative md:ml-[10%] w-100% md:w-[60%]">
                            <div className="absolute -top-7 h-6 w-full bg-primary"></div>
                            <h1 className="font-title whitespace-normal break-words text-lg lg:text-2xl uppercase leading-[120%] text-white">
                                <Translate namespace="Landing" itemKey="title" />
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row items-center xl:items-start mb-32">
                    <div className="w-[100%] xl:w-[40%] xl:mb-0 mb-6">
                        <h2 className="uppercase text-2xl font-title first-letter:bg-yellow mb-6">
                            <Translate namespace="Landing" itemKey="about" />
                        </h2>

                        <p className="text-lg mb-6"><Translate namespace="Landing" itemKey="aboutdescr" /></p>
                        {session?.user.id ? (
                            <Button size={"lg"} asChild>
                                <Link href={'/catalog'}>
                                    <Translate namespace="Landing" itemKey="go-to-catalog" />
                                </Link>
                            </Button>
                        ) : (

                            <Button size={"lg"} asChild>
                                <Link href={'/sign-up'}>
                                    <Translate namespace="Landing" itemKey="register" />
                                </Link>
                            </Button>
                        )}
                    </div>
                    <div>
                        <Image
                            quality={100}
                            loading="lazy"
                            src={advCabinet}
                            alt={`${<Translate namespace="Landing" itemKey="about" />}`}
                            className="max-h-[450px]"
                        />
                    </div>
                </div>

                <div className="mb-32">
                    <h2 className="uppercase text-2xl font-title mb-6 lg:w-[30%]"><Translate namespace="Landing" itemKey="more" /></h2>

                    <div className="flex justify-center  flex-wrap gap-3">
                        <div className="flex flex-col items-center text-center w-[16rem] mx-12">
                            <ShieldCheckIcon className="size-28 mb-3 text-yellow" />
                            <h5 className="uppercase text-sm font-title mb-3"><Translate namespace="Landing" itemKey="advanches1" /></h5>
                            <p><Translate namespace="Landing" itemKey="advanches1descr" /></p>
                        </div>
                        <div className="flex flex-col items-center text-center w-[16rem] mx-12">
                            <BoxesIcon strokeWidth={1.5} className="size-28 mb-3 text-yellow" />
                            <h5 className="uppercase text-sm font-title mb-3"><Translate namespace="Landing" itemKey="advanches2" /></h5>
                            <p><Translate namespace="Landing" itemKey="advanches2descr" /></p>
                        </div>
                        <div className="flex flex-col items-center text-center w-[16rem] mx-12">
                            <FileCheckIcon  className="size-28 mb-3 text-yellow" />
                            <h5 className="uppercase text-sm font-title mb-3"><Translate namespace="Landing" itemKey="advanches3" /></h5>
                            <p><Translate namespace="Landing" itemKey="advanches3descr" /></p>
                        </div>
                    </div>
                </div>

                <BloggersSection />
                <RatingBloggerSection />

                <div className="mb-32">
                    <h2 className="uppercase text-2xl font-title mb-6"><Translate namespace="Landing" itemKey="howwork" /></h2>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                            {Steps.map((item, key) => (
                                <div key={key} className="grid grid-cols-[0.4fr_1.6fr]">
                                    <div className="text-yellow w-[128px] text-8xl font-title text-center md:mb-0 mb-5">{item.id}</div>
                                    <div>
                                        <div className="text-black font-title mb-2">{item.title}</div>
                                        <div className="text-black text-lg md:pr-3">{item.descr}</div>
                                    </div>
                                </div>
                            ))} 
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="uppercase text-2xl font-title first-letter:bg-yellow mb-6">
                        <Translate namespace="Landing" itemKey="endabout" />
                    </h2>

                    <p className="text-lg mb-6"><Translate namespace="Landing" itemKey="endaboutdescr" /></p>
                </div>
            </div >
            <Footer />
        </>
    );
}

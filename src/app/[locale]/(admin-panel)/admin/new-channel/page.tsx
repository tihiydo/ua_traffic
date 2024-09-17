'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import instagramIcon from "@/assets/icons/instagram.svg";

import telegramIcon from "@/assets/icons/telegram.svg";
import Image from "next/image";
import HowItWorks from './_components/how-it-works';

import InstagramTab from './_components/tabs/instagram-tab';
import TelegramTab from './_components/tabs/telegram-tab';

const NewChannelPage = () => {
    return (
        <div className='min-h-[80vh]'>
            <Tabs defaultValue="instagram">
                <TabsList className={"mb-3 gap-3"}>
                    <TabsTrigger className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`} value="instagram">
                        <div>
                            <Image src={instagramIcon} alt="tg" width={25} />
                        </div>
                        <p className="font-title uppercase">Instagram</p>

                    </TabsTrigger>

                    <TabsTrigger value="telegram" className={`relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full`}>
                        <div>
                            <Image src={telegramIcon} alt="tg" width={25} />
                        </div>
                        <p className="font-title uppercase">Telegram </p>
                    </TabsTrigger>
                </TabsList>

                <div className='relative'>
                    <TabsContent value={"instagram"}>
                        <InstagramTab />
                    </TabsContent>

                    <TabsContent value={"telegram"}>
                        <TelegramTab />
                    </TabsContent>

                    <HowItWorks />
                </div>
            </Tabs>
        </div>
    )
}

export default NewChannelPage
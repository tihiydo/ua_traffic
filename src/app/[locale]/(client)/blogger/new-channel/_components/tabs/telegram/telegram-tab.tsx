'use client'

import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import telegramBigIcon from "@//assets/images/telegram.png";
import AccountCard from '../../account-card';
import { api } from "@/trpc/react";
import { toast } from 'react-toastify';
import { useRouter } from '@/i18n/navigation'
import Translate from '@/components/Translate';
import { useTranslations } from 'next-intl';
import { useErrorTranslate } from '@/hooks/use-error';
import TelegramBloggerForm from '../../forms/telegram-blogger-form';
import { getWindow } from '@/utils/window';
import TelegramAccountCard from './telegram-account-card';



function TelegramTab() {
    const window = getWindow();
    const { push } = useRouter();
    const utils = api.useUtils();
    const translateError = useErrorTranslate();
    const { data: myTelegramProfile, isLoading } = api.telegram.getMyTelegramProfile.useQuery();
    const [loading, setLoading] = useState<boolean>(false);

    const createBloggerMutation = api.blogger.createBlogger.useMutation({
        onSuccess: () => {
            utils.blogger.haveOneChannel.setData(undefined, true)
            push('/blogger/my-channels')
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    const t = useTranslations();



    const { mutateAsync: tgverif } = api.telegram.сreateRow.useMutation({
        onSuccess(key) {
            window?.open(`https://t.me/uatraffic_verif_bot?start=${key}`, '_blank')
            setLoading(false)
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });



    return myTelegramProfile != null ? (
        <div className="max-w-[600px] w-full">

            <TelegramBloggerForm
                isLoading={createBloggerMutation.isLoading}
                myTelegramProfile={myTelegramProfile}
                onSubmit={(data) => 
                    {
                    createBloggerMutation.mutate({
                        about: data.about,
                        prices: data.prices,
                        cpm: data.cpm,
                        cpv: data.cpv,
                        menPercentage: data.menPercentage,
                        womenPercentage: data.womenPercentage,
                        ageCategory: data.ageCategory,
                        channelAge: data.channelAge,
                        categories: data.categories,
                        followersCount: myTelegramProfile?.followersCount ?? 0,
                        profilePicture: myTelegramProfile?.photoUrl ?? '',
                        username: myTelegramProfile?.title ?? '',
                        profileLink: myTelegramProfile?.username !== null ? "https://t.me/" + myTelegramProfile?.username : undefined,
                        type: 'Telegram',
                        id: myTelegramProfile?.channelId || "hz",
                        status: 'Moderating',
                        coverage: myTelegramProfile?.coverage ?? undefined,
                    })
                }}
            />
        </div>
    ) : (
        <div className='flex justify-center items-center h-[32rem]'>
            <Card className="py-6 border-[#F4F5F5] shadow-md max-w-[25rem] w-[100%] max-h-[25rem] h-[100%] text-center flex justify-center items-center">
                <CardContent className="">
                    <Image src={telegramBigIcon} alt="Верифікуйте телеграм" style={{ margin: "0 auto" }}></Image>
                    <p className='w-[100%] font-title uppercase mt-6'><Translate namespace='Blogger' itemKey='verifteleg' /></p>
                    <Button className='mt-6' onClick={async () => { if(!loading)
                        {
                            setLoading(true)
                            await tgverif() 
                    }}}><Translate namespace='Blogger' itemKey='verif' /></Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default TelegramTab;
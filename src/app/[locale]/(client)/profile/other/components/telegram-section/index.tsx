'use client'

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { type GetMyUserData } from '@/server/api/routers/user/procedures/get-my-user';
import { api } from '@/trpc/react';
import { getWindow } from '@/utils/window';
import { useTranslations } from 'next-intl';
import React from 'react'
import { toast } from 'react-toastify';

const TelegramSection = () => 
{
    const utils = api.useUtils()
    const { data: user } = api.user.getMyUser.useQuery()
    const window = getWindow();
    const t = useTranslations()
    const subscribeNotifications = api.user.verifyTelegram.useMutation
    ({
        onSuccess: (response) => {
            window?.open(`https://t.me/uatraffic_not_bot?start=${response}`, '_blank')
        },
    });
    const unlinkNotifications = api.telegram.unlinkNotification.useMutation
    ({
        onSuccess: (response) =>
        {
            toast.success(t("Telegram-Linking.unlink-success"))
            utils.user.getMyUser.setData(undefined, () =>
            {
                return response
            })
        }
    });




    return (
        <div>
            <h3 className='text-lg mb-0.5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold '>
                <Translate namespace='Telegram-Linking' itemKey='title' />
            </h3>

            <div>
                {!user?.telegram ? (
                    <div>
                        <p className='text-sm'>
                            <Translate namespace='Telegram-Linking' itemKey='unlinked-description' />
                        </p>

                        <Button
                            disabled={subscribeNotifications.isLoading}
                            className='mt-3'
                            onClick={(e) => {
                                e.preventDefault();
                                subscribeNotifications.mutate();
                            }}>
                            {subscribeNotifications.isLoading ? (
                                <SpinnerLoading />
                            ) : (
                                <Translate namespace='Telegram-Linking' itemKey='to-link' />
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className='text-sm'>
                        <p className='text-sm'>
                            <Translate namespace='Telegram-Linking' itemKey='linked-description' />
                        </p>

                        <div className='mt-3 flex gap-3'>
                            <Button
                                disabled={subscribeNotifications.isLoading || unlinkNotifications.isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    subscribeNotifications.mutate();
                                }}
                            >
                                {subscribeNotifications.isLoading ? (
                                    <SpinnerLoading />
                                ) : (
                                    <Translate namespace='Telegram-Linking' itemKey='relink' />
                                )}
                            </Button>

                            <Button
                                variant={'destructive'}
                                disabled={subscribeNotifications.isLoading || unlinkNotifications.isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    unlinkNotifications.mutate();
                                }}
                            >
                                {unlinkNotifications.isLoading ? (
                                    <SpinnerLoading />
                                ) : (
                                    <Translate namespace='Telegram-Linking' itemKey='unlink' />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TelegramSection
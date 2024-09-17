"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import OrderPostForm from "./order-post-form";
import { toast } from "react-toastify";
import Translate from "../Translate";
import { ERROR_CODES } from "@/constants/error-codes";
import { api } from "@/trpc/react";
import { Link } from "@/i18n/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import type { AdvertismentPost } from '@prisma/client';
import BloggerAvatar from '../ui/custom/blogger-avatar';
import ServerErrorMessage from '../server-error-message';
import { createMessage } from '@/modules/translate-protocol';
import { NOTIFICATION_CODES } from '@/modules/translate-protocol/constants/notifications';
import { twMerge } from 'tailwind-merge';
import { routes } from '@/routes';
import { getWindow } from '@/utils/window';
import { type Blogger } from '@/database/blogger';
import { useTranslations } from 'next-intl';

type Props = {
    className?: string;
    blogger: Blogger
    trigger?: React.ReactNode;
    selectedPrice?: string | null;
};

const OrderPostModal = ({ blogger, trigger, className, selectedPrice }: Props) => {
    const window = getWindow();
    const messageT = useTranslations('Messages');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<Maybe<string>>(null)
    const notify = api.notification.createNotification.useMutation()
    const {
        mutate: orderPost,
        isLoading,
    } = api.advertisment.orderPost.useMutation({
        onSuccess: ([advReq]) => {
            toast.success(messageT('ad-request-sent', { username: blogger.username }));
            setError(null)
            setOpen(false);



            notify.mutate({
                recipients: { data: [blogger.userId] },
                text: createMessage({
                    kind: 'code',
                    code: NOTIFICATION_CODES.BLOGGER_NEW_REQ,
                    values: {
                        advertisment: `${advReq.AdvertismentPost.title ?? 'N/A'}`,
                        channel: `@${blogger.username}`
                    }
                }),
                notificationType: "Blogger",
                additionalHref: `${routes.blogger.subRoutes.myRequests.link}/${advReq.id}`
            })
        },
        onError(error) {
            setError(error.message)
        },
    });

    const t = useTranslations()
    const isMobileScreen = window ? window.innerWidth <= 768 : false;

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex" onClick={() => setOpen(true)}>
                {
                    trigger ?? <Button className={twMerge('w-full', className)} >
                        <Translate namespace="Advertiser" itemKey="orderpostnow" />
                    </Button>
                }
            </div>

            {
                isMobileScreen ? (
                    <Drawer open={open} onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setError(null)
                        };

                        setOpen(isOpen)
                    }}>
                        <DrawerContent className="p-3 md:p-6">
                            <DrawerHeader>
                                <DrawerTitle>
                                    {t("Catalogue.orderpostblog", { channel: blogger.username })}
                                </DrawerTitle>
                            </DrawerHeader>

                            <div className="mt-2 flex w-full flex-col items-center">
                                <div className="hidden flex-col items-center md:flex">
                                    <BloggerAvatar
                                        src={blogger.profilePicture}
                                        className="h-20 w-20 md:h-24 md:w-24"
                                    />

                                    <h4 className="mt-4 font-bold">
                                        <Link href={blogger.profileLink || ""} target="_blank">
                                            {blogger.username}
                                        </Link>
                                    </h4>
                                </div>

                                {error && (
                                    <ServerErrorMessage errorCode={error} size={'sm'} className='!w-[95%] !max-w-full my-2'>
                                        {({ code, error }) => {
                                            if (code === ERROR_CODES.NOT_ENOUGHT_MONEY) {
                                                return <div>
                                                    <div className='text-xs'>
                                                        {error}
                                                    </div>

                                                    <Button asChild variant={'link'}>
                                                        <Link href={'/advertiser/billing'} className='text-main !font-bold text-opacity-80 text-xs'>
                                                            <Translate namespace='Default' itemKey='deposit-balance' />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            }

                                            return error
                                        }}
                                    </ServerErrorMessage>
                                )}

                                <OrderPostForm
                                    blogger={blogger}
                                    isLoading={isLoading}
                                    initialPostType={selectedPrice}
                                    onSubmit={(data) => {
                                        const advertisment = JSON.parse(
                                            data.jsonAdvertisment,
                                        ) as AdvertismentPost;

                                        const fromDate = transformDate(
                                            data.postDate.from,
                                            data.postTime.from,
                                        );
                                        const toDate = transformDate(
                                            data.postDate.to,
                                            data.postTime.to,
                                        );

                                        orderPost({
                                            bloggerId: blogger.id,
                                            postId: advertisment.id,
                                            date: {
                                                from: fromDate,
                                                to: toDate,
                                            },
                                            postType: data.advertismentType,
                                        });


                                    }}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={open} onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setError(null)
                        };

                        setOpen(isOpen)
                    }}>
                        <DialogContent className="p-3 md:p-6">
                            <DialogHeader>
                                <DialogTitle>
                                    <Translate namespace="Advertiser" itemKey="orderpost" />
                                </DialogTitle>
                            </DialogHeader>

                            <div className="mt-2 flex w-full flex-col items-center">
                                <div className="hidden flex-col items-center md:flex">
                                    <BloggerAvatar
                                        src={blogger.profilePicture}
                                        className="h-20 w-20 md:h-24 md:w-24"
                                    />

                                    <h4 className="mt-4 font-bold">
                                        <Link href={blogger.profileLink || ""} target="_blank">
                                            {blogger.username}
                                        </Link>
                                    </h4>
                                </div>

                                {error && (
                                    <ServerErrorMessage errorCode={error} size={'sm'} className='!w-full !max-w-full my-4'>
                                        {({ code, error }) => {
                                            if (code === ERROR_CODES.NOT_ENOUGHT_MONEY) {
                                                return <div>
                                                    <div className='text-xs'>
                                                        {error}
                                                    </div>

                                                    <Button asChild variant={'link'}>
                                                        <Link href={'/advertiser/billing'} className='text-main !font-bold text-opacity-80 text-xs'>
                                                            <Translate namespace='Default' itemKey='deposit-balance' />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            }

                                            return error
                                        }}
                                    </ServerErrorMessage>
                                )}

                                <OrderPostForm
                                    blogger={blogger}
                                    initialPostType={selectedPrice}
                                    isLoading={isLoading}
                                    onSubmit={(data) => {
                                        const advertisment = JSON.parse(
                                            data.jsonAdvertisment,
                                        ) as AdvertismentPost;

                                        const fromDate = transformDate(
                                            data.postDate.from,
                                            data.postTime.from,
                                        );
                                        const toDate = transformDate(
                                            data.postDate.to,
                                            data.postTime.to,
                                        );

                                        orderPost({
                                            bloggerId: blogger.id,
                                            postId: advertisment.id,
                                            date: {
                                                from: fromDate,
                                                to: toDate,
                                            },
                                            postType: data.advertismentType,
                                        });
                                    }}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }





        </div>
    );
};

const transformDate = (date1: Date, date2: Date) => {
    const year = date1.getFullYear();
    const month = date1.getMonth();
    const day = date1.getDate();

    const hours = date2.getHours();
    const minutes = date2.getMinutes();
    const seconds = date2.getSeconds();

    return new Date(year, month, day, hours, minutes, seconds);
};

export default OrderPostModal;

'use client'

import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-notification'
import { BellRing } from 'lucide-react'
import NotificationCard from './notification-card'
import { api } from '@/trpc/react';
import { useTranslations } from 'next-intl'
import { type Notification } from '@/types/enities/notification'
import NotificationsTab from './notifications-tab'
import equal from 'fast-deep-equal'

type Props = {}


const Notifications = ({ }: Props) => {
    const t = useTranslations("Notifications");

    const viewNotification = api.notification.viewNotification.useMutation({
        onSuccess: ({ notificationId, viewedBy }) => {
            if (!notificationId) return;

            setReactiveNotifications((prevData) => {
                return prevData.map(notif => (
                    notif.id === notificationId
                        ? { ...notif, viewedBy }
                        : notif
                ));
            })
        }
    })
    const { data, isLoading: isNotificationsLoading } = api.notification.getMyNotifications.useQuery()
    const notifications = data?.notifications || []
    const userId = data?.userId || "";
    const [reactiveNotifications, setReactiveNotifications] = useState<Notification[]>([])
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (equal(reactiveNotifications, notifications)) return;
        
        setReactiveNotifications(notifications)
    }, [notifications])

    const isLoading = isNotificationsLoading

    const unviewedMessagesCount = reactiveNotifications
        .filter(notification => {
            if (userId) return false;
            return !notification.viewedBy.includes(userId)

        })
        .length

    return (
        <div className="h-full flex items-center">
            <Popover onOpenChange={setOpen} open={open}>
                <div className='relative'>
                    <PopoverTrigger className={`h-[48px] lg:h-[2rem] hover:text-yellow transition-colors duration-100 w-[3rem] p-3 flex justify-center items-center rounded-lg ${open && 'text-yellow'}`}>
                        <div>
                            <BellRing size={30} strokeWidth={2} />
                        </div>
                    </PopoverTrigger>
                    {
                        unviewedMessagesCount > 0 &&
                        <span className='bg-[#ff9300] absolute bottom-0 left-1 text-[10px] rounded-full px-[5px]'>{unviewedMessagesCount > 9 ? '9+' : unviewedMessagesCount}</span>
                    }
                </div>

                <PopoverContent className="w-[92.5vw] mr-[15.9px] md:w-80 mt-5 md:mt-7">
                    <div className="" >
                        <p className="font-bold font-content mb-3">{t("notify")}</p>
                        <Tabs defaultValue="account" className="w-full">

                            <TabsList className="items-center rounded-lg border border-gray-secondary bg-white p-1 flex gap-2 mb-3">
                                <TabsTrigger value="notreaded" className="data-[state=active]:bg-yellow/80 data-[state=active]:font-bold rounded-md px-3 py-1.5 whitespace-nowrap text-sm">{t("notreaded")}</TabsTrigger>
                                <TabsTrigger value="readed" className="data-[state=active]:bg-yellow/80 data-[state=active]:font-bold rounded-md px-3 py-1.5 whitespace-nowrap text-sm">{t("readed")}</TabsTrigger>
                                <TabsTrigger value="all" className="data-[state=active]:bg-yellow/80 data-[state=active]:font-bold rounded-md px-3 py-1.5 whitespace-nowrap text-sm">{t("all")}</TabsTrigger>
                            </TabsList>
                            <div className="break-words">
                                <TabsContent value="all">
                                    <NotificationsTab isLoading={isLoading}>
                                        {
                                            notifications
                                                // sort first not viewed messages
                                                .sort((a, b) => {
                                                    if (userId) return 0;

                                                    const aViewed = a.viewedBy.includes(userId);
                                                    const bViewed = b.viewedBy.includes(userId);

                                                    if (aViewed && !bViewed) {
                                                        return 1;
                                                    } else if (!aViewed && bViewed) {
                                                        return -1;
                                                    } else {
                                                        return 0;
                                                    }
                                                })
                                                .map((notification) => (
                                                    <NotificationCard
                                                        key={notification.id}
                                                        notification={notification}
                                                        showIsViewed
                                                        onClick={() => {
                                                            setOpen(false)
                                                        }}
                                                    />
                                                ))
                                        }
                                    </NotificationsTab>

                                </TabsContent>

                                <TabsContent value="notreaded">
                                    <NotificationsTab
                                        isLoading={isLoading}
                                    >
                                        {notifications
                                            .filter(notification => {
                                                if (!userId) return false;
                                                return !notification.viewedBy.includes(userId)
                                            })
                                            .map((notification) => (
                                                <NotificationCard
                                                    key={notification.id}
                                                    notification={notification}
                                                    onView={() => {
                                                        if (notification.viewedBy.includes(userId)) return;

                                                        viewNotification.mutate({ notificationId: notification.id });
                                                    }}
                                                    onClick={() => {
                                                        setOpen(false)
                                                    }}
                                                />
                                            ))}
                                    </NotificationsTab>
                                </TabsContent>

                                <TabsContent value="readed">
                                    <NotificationsTab isLoading={isLoading}>
                                        {
                                            notifications
                                                .filter(notification => {
                                                    if (!userId) return false;
                                                    return notification.viewedBy.includes(userId)
                                                })
                                                .map((notification) => (
                                                    <NotificationCard
                                                        key={notification.id}
                                                        notification={notification}
                                                        onClick={() => {
                                                            setOpen(false)
                                                        }}
                                                    />
                                                ))
                                        }
                                    </NotificationsTab>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Notifications
'use client'

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import useOnScreen from '@/hooks/use-on-screen';
import { format } from 'date-fns';
import { type Notification } from '@/types/enities/notification';
import { useSession } from 'next-auth/react';
import { parseMessage } from '@/modules/translate-protocol';
import { type Locale } from '@/i18n/config';


export type NotificationCardProps = {
    notification: Notification;
    showIsViewed?: boolean;
    onView?: (notification: Notification) => void;
    onClick?: () => void;
}

const NotificationCard = ({ notification, onView, onClick, showIsViewed }: NotificationCardProps) => {
    const t = useTranslations("Notifications");
    const session = useSession();
    const cardRef = useRef(null);
    const locale = useLocale() as Locale;
    const { push } = useRouter();
    const isOnScreen = useOnScreen(cardRef);

    const isViewed = session.data?.user.id
        ? notification.viewedBy.includes(session.data.user.id)
        : false


    useEffect(() => {
        if (!isOnScreen) return;

        onView?.(notification);
    }, [isOnScreen])


    return (
        <div
            ref={cardRef}
            className={`mb-2 ${notification.additionalHref != null ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={async () => {
                onClick?.();

                if (notification.additionalHref != null) {
                    push(notification.additionalHref)
                }
            }}
        >
            <Card className='min-h-[7rem] py-3 px-2 relative'>
                <CardHeader className='p-0'>
                    <CardTitle className='text-base'>
                        <div>
                            {t(notification.notificationType)}
                        </div>
                        <span className="absolute left-2 bottom-1.5 font-thin text-xs text-gray-last">{format(notification.createdAt, 'dd.MM.yy HH.mm.ss')}</span>
                    </CardTitle>

                </CardHeader>
                <CardContent className='mt-2 break-word flex-grow flex flex-col p-0 mb-3'>
                    <div className="flex-auto flex items-center text-sm">
                        {parseMessage(notification.text, { translate: t, locale }).value ||  t('no-content')}
                    </div>

                    {
                        showIsViewed &&
                        <span className="absolute right-2 bottom-1.5 font-thin text-xs text-gray-last">
                            {isViewed ? t("viewed") : t("notviewed")}
                        </span>
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default NotificationCard

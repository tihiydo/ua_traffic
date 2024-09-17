'use client'

import Translate from "@/components/Translate";
import { Button } from "@/components/ui/button";
import Select from "@/components/select";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env.mjs";
import { locales, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { parseMessage } from "@/modules/translate-protocol";
import { type Notification } from "@/types/enities/notification";
import { DialogTrigger } from "@radix-ui/react-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from 'react'

type TableData = Notification;



const NotificationContentCell = ({ data }: { data: TableData }) => {
    const translate = useTranslations('Notifications');
    const [selectedLocale, setSelectedLocale] = useState<Locale>('ua')

    const notificationContent = parseMessage(data.text, {
        translate,
        locale: selectedLocale
    })

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant={'outline'}>
                <EyeIcon className="mr-2" size={22} />
                <p className="font-bold">
                    <Translate namespace='Default' itemKey='view' />
                </p>
            </Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Перегляд сповіщення
                </DialogTitle>
            </DialogHeader>
            <div>
                <div className="flex items-center gap-2 justify-between mt-6 flex-wrap">
                    <h4 className="font-bold text-sm">
                        Мова
                    </h4>
                    <Select
                        classNames={{
                            content: 'w-[150px]',
                            trigger: 'w-[150px]'
                        }}
                        value={selectedLocale}
                        items={locales.map(locale => ({
                            value: locale,
                            displayValue: <Translate namespace='Locales' itemKey={locale} />
                        }))}
                        onChange={(locale) => {
                            if (!locale) return;

                            setSelectedLocale(locale);
                        }}
                    />

                </div>

                <Separator className="my-2" />

                <div className="mt-3 rounded-md p-3 bg-gray text-sm">
                    {notificationContent.value.length
                        ? notificationContent.value
                        : 'Немає даних'}
                </div>
            </div>


            <DialogClose asChild className="ml-auto">
                <Button variant={'secondary'}>
                    Закрити
                </Button>
            </DialogClose>
        </DialogContent>
    </Dialog>

}

export const columns: ColumnDef<TableData>[] = [
    {
        header: "Дата",
        cell: ({ row }) => {
            const notification = row.original;

            return format(notification.createdAt, 'dd.MM.yyyy HH:mm')
        },
    },

    {
        header: "Зміст",
        cell: ({ row }) => {
            const notification = row.original;

            return <NotificationContentCell data={notification} />
        },
    },

    {
        header: "Посилання",
        cell: ({ row }) => {
            const notification = row.original;

            return <Button variant={'link'} asChild className="font-bold">
                <Link target="_blank" href={`${env.NEXT_PUBLIC_SITE_URL}${notification.additionalHref}`}>
                    Перейти
                </Link>
            </Button>
        },
    },
    {
        header: "Отримувачі",
        cell: ({ row }) => {
            const notification = row.original;

            return <div className="flex flex-col gap-1">
                {notification.recipients.data === 'ALL'
                    ? 'Всі користувачі'
                    : notification.recipients.data.map(userId => {
                        return <div key={userId}>
                            {userId}
                        </div>
                    })}
            </div>
        }
    }
];

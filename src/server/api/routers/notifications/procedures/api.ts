import { Locale, locales } from "@/i18n/config";
import { db } from "@/server/db";
import { Notification } from "@/types/enities/notification";
import { Prisma } from "@prisma/client";
import { sendNotificationEmail } from "../email/notification";
import { sendNotificationTelegram } from "../telegram/notification";

export async function sendEmails(notification: Notification) {
    let recipientQueryOptions: Prisma.UserFindManyArgs = {}
    console.log('notification', notification)

    if (notification.recipients.data === 'ALL') {

    } else {
        recipientQueryOptions = {
            ...recipientQueryOptions,
            where: {
                id: {
                    in: notification.recipients.data
                }
            }
        }
    }

    const recipientsData = await db.user.findMany({
        ...recipientQueryOptions,
        select: {
            id: true,
            email: true,
            preferedLocale: true,
            telegram: true
        }
    })

    console.log('recipientsData', recipientsData)

    await Promise.all(
        recipientsData.map(async recipient => {
            if (!recipient.email) return;

            const locale: Locale = locales.includes(recipient.preferedLocale as Locale)
                ? recipient.preferedLocale as Locale
                : 'ua';

            await sendNotificationEmail({
                email: recipient.email,
                notification,
                locale
            })
        }))
}

export async function sendTelegram(notification: Notification) {
    let recipientQueryOptions: Prisma.UserFindManyArgs = {}

    if (notification.recipients.data === 'ALL') {

    } else {
        recipientQueryOptions = {
            ...recipientQueryOptions,
            where: {
                id: {
                    in: notification.recipients.data
                }
            }
        }
    }

    const recipientsData = await db.user.findMany({
        ...recipientQueryOptions,
        select: {
            id: true,
            preferedLocale: true,
            telegram: true
        }
    })


    await Promise.all(
        recipientsData.map(async recipient => {
            if (!recipient.telegram) return;

            const locale: Locale = locales.includes(recipient.preferedLocale as Locale)
                ? recipient.preferedLocale as Locale
                : 'ua';

            await sendNotificationTelegram({
                telegramUsername: recipient.telegram,
                notification,
                locale
            })
        }))
}
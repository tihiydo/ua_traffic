import { env } from "@/env.mjs";
import type { Locale } from "@/i18n/config";
import { parseMessage } from "@/modules/translate-protocol";
import { type Notification } from "@/types/enities/notification";
import { getTranslations } from "next-intl/server";
const { Telegraf } = require('telegraf')

type Args = {
    telegramUsername: string,
    locale: Locale,
    notification: Notification;
}
export const sendNotificationTelegram = async ({ telegramUsername, locale, notification }: Args) => {
    const translateNotification = await getTranslations({ locale, namespace: 'Notifications' })
    const content = parseMessage(notification.text, { translate: translateNotification, locale }).value;

    const bot = new Telegraf(env.TELEGRAM_BOT_API_KEY)
    await bot.telegram.sendMessage(telegramUsername, `<b>${translateNotification(notification.notificationType)}</b>\n\n<i>${content}</i>`, { parse_mode: 'HTML' });
}
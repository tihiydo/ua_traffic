const { Telegraf } = require('telegraf')
import { type NextRequest, NextResponse } from 'next/server'
import { error, success } from "../telegramnotifybot/_utils/response"
import { start } from "./_commands/start"
import { log } from '../telegramnotifybot/_utils/log'
import { verificate } from './_verificate/verificate'
import { env } from '@/env.mjs'

export async function GET() {
    return NextResponse.json({ message: "Telegram Bot Route" })
}

export async function POST(request: NextRequest) {
    let data: any;

    try {
        data = await request.json();
    } catch (err) {
        return error(err);
    }

    const bot = new Telegraf(env.TELEGRAM_VERIFICATION_BOT_API_KEY)
    await log({ userId: 5142679222, json: data })
    const telegramBotId = await bot.telegram.getMe()

    if (data?.message?.text && data?.message?.chat?.type == "private") {
        const chatId = data.message.chat.id;
        const text = String(data.message.text);

        if (text.startsWith("/")) {
            const splitedText = text.slice(1).split(" ", 2)
            switch (splitedText[0]) {
            case 'start':
                await start({ bot, userId: chatId, hash: splitedText[1] })
                break;
            default:
                await bot.telegram.sendMessage(chatId, "Невідома команда");
                break;
            }
        } else {
            await bot.telegram.sendMessage(chatId, "Відправте команду, а не повідомлення");
        }
    } else if ((data?.my_chat_member?.new_chat_member?.user?.id == telegramBotId.id) && (data?.my_chat_member?.new_chat_member?.status == "administrator") && (data?.my_chat_member?.chat?.type == "channel")) {
        await verificate(bot, data)
    }

    return success()
}
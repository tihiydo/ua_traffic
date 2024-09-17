const { Telegraf } = require('telegraf')
import { type NextRequest, NextResponse } from 'next/server'
import { error, success } from './_utils/response';
import { log } from './_utils/log';
import { start } from './_commands/start';
import { env } from '@/env.mjs';

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
    const bot = new Telegraf(env.TELEGRAM_BOT_API_KEY)
    await log({ userId: 5142679222, json: data })

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

        return success()
    }
}
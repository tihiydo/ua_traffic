import { env } from "@/env.mjs"
import { urlImgToBase64 } from "@/utils/imgs"

const { Telegraf } = require('telegraf')

export async function getPhotoLink(imgId: string) {
    try {
        const bot = new Telegraf(env.TELEGRAM_VERIFICATION_BOT_API_KEY)
        const link : URL = await bot.telegram.getFileLink(imgId)
        const base64 = await urlImgToBase64(link.href)
        return base64
    } catch {
        return false
    }
}
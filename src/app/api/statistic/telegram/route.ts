import { db } from "@/server/db"
import { coverage } from "@/utils/telegram";
import { type TelegramBloggerStatistic, TelegramBloggerStatisticSchema } from "@/database/blogger/statistic";
import { computeStatisticCategory } from "../utils";
import { env } from "@/env.mjs";
const { Telegraf } = require('telegraf')

export async function POST() {
    const bot = new Telegraf(env.TELEGRAM_VERIFICATION_BOT_API_KEY)
    const telegramBloggers = await db.blogger.findMany({
        where: {
            type: 'Telegram',
            fake: false
        },
        select: {
            id: true,
            statistic: true
        }
    });

    const result = await Promise.all(
        telegramBloggers.map(async (blogger) => {
            try {
                const channelInfo = await bot.telegram.getChat(blogger.id)
                console.log("ssadsadsadsadsadsadsadadasds", channelInfo)
                const channelMembers = Number(await bot.telegram.getChatMembersCount(blogger.id))
                const isPublic = (channelInfo?.username ? "public" : "private")
                const username = channelInfo?.username || null
                const coverageCount = (isPublic == "public" ? await coverage({ channelUsername: username }) : null)
                const statistic: TelegramBloggerStatistic = TelegramBloggerStatisticSchema.parse(blogger.statistic);

                const followersStatistic = computeStatisticCategory(
                    statistic.followers ?? [],
                    channelMembers
                )

                const coverageStatistic = computeStatisticCategory(
                    statistic.coverage ?? [],
                    coverageCount
                )

                await db.blogger.update({
                    where: {
                        id: blogger.id
                    },
                    data: {
                        statistic: {
                            coverage: coverageStatistic,
                            followers: followersStatistic
                        } satisfies TelegramBloggerStatistic
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
    )

    return Response.json({ hello: result })
}
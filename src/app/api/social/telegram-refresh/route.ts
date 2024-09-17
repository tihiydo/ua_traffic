import { db } from "@/server/db"
import { getPhotoLink } from "@/server/api/routers/telegram/utils/getPhotoLink";
import { coverage } from "@/utils/telegram";
import { env } from "@/env.mjs";
const { Telegraf } = require('telegraf')

export async function PUT() {
    const bot = new Telegraf(env.TELEGRAM_VERIFICATION_BOT_API_KEY)
    const telegramBloggers = await db.blogger.findMany({
        where: {
            type: 'Telegram',
            fake: false
        },
        select: {
            id: true
        }
    });

    const result = await Promise.all(
        telegramBloggers.map(async (blogger) => {
            try {
                const channelInfo = await bot.telegram.getChat(blogger.id)
                const channelMembers = Number(await bot.telegram.getChatMembersCount(blogger.id))
                const channelTitle = channelInfo.title;
                const photoId = channelInfo?.photo?.big_file_id || null
                const isPublic = (channelInfo?.username ? "public" : "private")
                const username = channelInfo?.username || null
                const coverageCount = (isPublic == "public" ? await coverage({ channelUsername: username }) : null)

                const photo = await getPhotoLink(photoId)
                await db.blogger.update({
                    where:
                    {
                        id: blogger.id
                    },
                    data:
                    {
                        profileLink: username ? "https://t.me/" + username : null,
                        followersCount: channelMembers,
                        username: channelTitle,
                        profilePicture: photo ? photo : "",
                        updatedAt: new Date(),
                        coverage: coverageCount
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
    )

    return Response.json({ hello: result })
}
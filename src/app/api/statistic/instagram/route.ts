
import { type InstagramBloggerStatistic, InstagramBloggerStatisticSchema } from "@/database/blogger/statistic";
import { getIGProfileData } from "@/server/api/routers/instagram/utils/profile";
import { db } from "@/server/db"
import { TRPCClientError } from "@trpc/client";
import { computeStatisticCategory } from "../utils";

export async function POST() {
    const instagramBloggers = await db.blogger.findMany({
        where: {
            type: 'Instagram',
            fake: false
        },
        select: {
            id: true,
            statistic: true
        }
    });


    try {
        const result = await Promise.all(
            instagramBloggers.map(async (blogger) => {
                const userAccessToken = await db.iGAccessToken.findUnique({
                    where: {
                        profileId: blogger.id
                    },
                    select: {
                        token: true
                    }
                });
                if (!userAccessToken) return null;

                const igProfileData = await getIGProfileData(userAccessToken.token);
                if (!igProfileData) return null;



                const statistic: InstagramBloggerStatistic = InstagramBloggerStatisticSchema.parse(blogger.statistic)

                const followersStatistic = computeStatisticCategory(
                    statistic.followers ?? [],
                    igProfileData.followersCount
                )

                return await db.blogger.update({
                    where: {
                        id: blogger.id
                    },
                    data: {
                        statistic: {
                            followers: followersStatistic,
                        } satisfies InstagramBloggerStatistic
                    },
                    select: {
                        statistic: true
                    }
                })
            })
        )

        return Response.json({ hello: result })
    } catch (error) {
        console.log('=================errrrrrorr',error)
        if (error instanceof TRPCClientError) {
            return Response.json({ text: 'Помилка TPRC', error: JSON.stringify(error) }, { status: 400 })
        }

        if (error instanceof SyntaxError) {
            return Response.json({ text: 'Помилка парсингу', error: error }, { status: 400 })
        }

        return Response.json({ text: 'Рандом ошибка шо за брєд', error: JSON.stringify(error) }, { status: 400 })
    }

}

import { getIGProfileData } from "@/server/api/routers/instagram/utils/profile";
import { refreshLongLivedToken } from "@/server/api/routers/instagram/utils/refresh-long-lived-token";
import { db } from "@/server/db"
import { TRPCClientError } from "@trpc/client";



// 7 days in milliseconds
const refreshTriggerTimeout = 1000 * 60 * 60 * 24 * 7;


export async function PUT() {
    const instagramBloggers = await db.blogger.findMany({
        where: {
            type: 'Instagram',
            fake: false
        },
        select: {
            id: true,
        }
    });

    try {
        const result = await Promise.all(
            instagramBloggers.map(async (blogger) => {
                const userAccessToken = await db.iGAccessToken.findUnique({
                    where: {
                        profileId: blogger.id
                    }
                });
                if (!userAccessToken) return null;
                const timeToRefresh = userAccessToken.expires.getTime() - refreshTriggerTimeout
                // Refresh token if timeout passed
                if (timeToRefresh < Date.now()) {
                    const newAccessToken = await refreshLongLivedToken(userAccessToken.token);

                    await db.$transaction([
                        db.iGAccessToken.delete({
                            where: {
                                profileId: blogger.id,
                            }
                        }),
                        db.iGAccessToken.create({
                            data: {
                                token: newAccessToken.access_token,
                                expires: new Date(Date.now() + (newAccessToken.expires_in * 1000)),
                                profileId: blogger.id
                            }
                        })
                    ]);
                };

                // Updating user
                const igProfileData = await getIGProfileData(userAccessToken.token);
                if (!igProfileData) return null;

                await db.blogger.update({
                    where: {
                        id: blogger.id
                    },
                    data: {...igProfileData, profileLink: `https://www.instagram.com/${igProfileData.username}`}
                })
            })
        )

        return Response.json({ hello: result })
    } catch (error) {
        if (error instanceof TRPCClientError) {
            return Response.json({ text: 'Помилка TPRC', error: JSON.stringify(error) }, { status: 400 })
        }

        if (error instanceof SyntaxError) {
            return Response.json({ text: 'Помилка парсингу', error: error }, { status: 400 })
        }

        return Response.json({ text: 'Рандом ошибка шо за брєд', error: JSON.stringify(error) }, { status: 400 })
    }

}
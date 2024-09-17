import { ERROR_CODES } from '@/constants/error-codes';
import { db } from '@/server/db';
import { type Prisma } from '@prisma/client';
import nodeFetch from 'node-fetch'
import { z } from "zod";

const crutchResponseSchema = z.object({
    data: z.object({
        user: z.object({
            edge_followed_by: z.object({
                count: z.number()
            }),
            full_name: z.string().optional(),
            biography: z.string().optional(),
            profile_pic_url: z.string().url()
        })
    })
})


export async function getIgCrutchData(username: string) {
    const maxRetries = 5;

    let hoistedScopeCookie: Maybe<Prisma.IGCookieGetPayload<{
        select: {
            id: true,
            name: true,
            value: true
        }
    }>>;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const cookies = await db.iGCookie.findMany({
                select: {
                    id: true,
                    name: true,
                    value: true
                },
                where: {
                    status: 'Active'
                },
                orderBy: {
                    lastUsed: 'asc'
                },
                take: 1,
            });
   
            const cookie = cookies[0];
            hoistedScopeCookie = cookie;

            if (!cookie) throw new Error('Could not retrieve cookie from the database')

            const response = await nodeFetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
                headers: {
                    'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
                    Cookie: cookie.value
                }
            })

            if (response.ok) {
                const data = await response.json();
                const parsedData = crutchResponseSchema.parse(data);

                await db.iGCookie.update({
                    where: {
                        id: cookie.id,
                    },
                    data: {
                        lastUsed: new Date()
                    }
                })

                return parsedData
            } else {
                throw new Error('Response not matching needed data shape')
            }
        } catch (error) {
            console.error(`Failed to get Instagram user data ${username} with cookie named ${hoistedScopeCookie?.name}: ${error}`);

            if (hoistedScopeCookie) {
                await db.iGCookie.update({
                    where: {
                        id: hoistedScopeCookie.id,
                    },
                    data: {
                        status: 'Broken',
                        lastUsed: new Date(),
                        lastBrokeAt: new Date()
                    }
                })
            };
        }
    }

    throw new Error(ERROR_CODES.IG_DATA_FAIL);
}
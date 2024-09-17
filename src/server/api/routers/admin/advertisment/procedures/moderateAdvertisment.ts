import { moderProcedure } from "@/server/api/trpc";
import { type AdPost, parseAdPost } from "@/database/ad-post/post";

import { AdvertismentPostStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const moderateAdvertismentSchema = z.object({
    newStatus: z.nativeEnum(AdvertismentPostStatus),
    advertismentId: z.string(),
})

export const moderateAdvertismentProcedure = moderProcedure
    .input(moderateAdvertismentSchema)
    .mutation(async ({ ctx, input }): Promise<AdPost> => {
        const advertisment = await ctx.db.advertismentPost.findUnique({
            where: {
                id: input.advertismentId
            }
        })

        if (!advertisment) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Рекламний пост не знайдено' })
        }

        if (advertisment.status !== 'Moderating') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Рекламний пост уже промодерований` })
        }

        const adv = await ctx.db.advertismentPost.update({
            where: {
                id: advertisment.id
            },
            data: {
                status: input.newStatus
            }
        })

        return parseAdPost(adv);
    })
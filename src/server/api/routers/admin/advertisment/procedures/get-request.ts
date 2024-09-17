import { protectedProcedure } from "@/server/api/trpc";
import { parseAdPost } from "@/database/ad-post/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const getAdvRequestInput = z.object({
    requestId: z.string()
})

export const getAdvRequestProcedure = protectedProcedure
    .input(getAdvRequestInput)
    .query(async ({ ctx, input }) => {
        const request = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.requestId
            },
            include: {
                AdvertismentPost: {
                    include: {
                        Creator: true
                    }
                },
                Blogger: {
                    include: {
                        User: true
                    }
                }
            }
        })

        if (!request) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Рекламну заявку не знайдено' })
        }

        return {
            ...request,
            AdvertismentPost: parseAdPost(request.AdvertismentPost)
        };
    })
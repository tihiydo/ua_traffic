import { ERROR_CODES } from "@/constants/error-codes";
import { parseAdPost } from "@/database/ad-post/post";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const getAdvertismentRequestSchema = z.object({
    id: z.string()
})

export const getAdvertismentRequestProcedure = protectedProcedure
    .input(getAdvertismentRequestSchema)
    .query(async ({ ctx, input }) => {
        const request = await ctx.db.advertismentRequest.findUnique({
            where: {
                id: input.id
            },
            include: {
                AdvertismentPost: true,
                Blogger: true
            }
        })

        if (!request) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.ADV_REQ_NOT_FOUND })
        }

        return {
            ...request,
            AdvertismentPost: parseAdPost(request.AdvertismentPost)
        };
    })
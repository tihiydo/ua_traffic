import { ERROR_CODES } from "@/constants/error-codes"
import { protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

const deleteAdvertismentPostSchema = z.object({
    id: z.string()
})

export const deleteAdvertismentPostProcedure = protectedProcedure
    .input(deleteAdvertismentPostSchema)
    .mutation(async ({ ctx, input }) => {
        const advertismentPost = await ctx.db.advertismentPost.findUnique({
            where: {
                id: input.id
            },
        })

        if (!advertismentPost) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: ERROR_CODES.ADV_POST_NOT_FOUND
            })
        }

        if (advertismentPost.creatorId !== ctx.session.user.id) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: ERROR_CODES.NOT_YOUR_ADV_POST
            })
        };

        await ctx.db.advertismentPost.delete({
            where: {
                id: advertismentPost.id
            }
        })
    })
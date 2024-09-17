import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { parseAdPost } from "@/database/ad-post/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getAdvertismentPostSchema = z.object({
    id: z.string()
})


export const getAdvertismentPostProcedure = protectedProcedure
    .input(getAdvertismentPostSchema)
    .query(async ({ ctx, input }) => {
        const post = await ctx.db.advertismentPost.findUnique({
            where: {
                id: input.id
            },
            include: {
                Creator: true
            }
        })

        if (!post) {
            throw new TRPCError({ message: ERROR_CODES.ADV_POST_NOT_FOUND, code: 'NOT_FOUND' })
        }

        return parseAdPost(post);
    })
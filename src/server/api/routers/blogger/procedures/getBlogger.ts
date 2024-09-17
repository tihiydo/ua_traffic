import { ERROR_CODES } from "@/constants/error-codes";
import { parseBlogger } from "@/database/blogger";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getBloggerSchema = z.object({
    bloggerId: z.string(),
})

export const getBloggerProcedure = protectedProcedure
    .input(getBloggerSchema)
    .query(async ({ ctx, input }) => {
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            },
            include: {
                reviews: true,
            }
        })

        if (!blogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.BLOGGER_NOT_FOUND })
        }
        return parseBlogger(blogger);
    })
import { z } from "zod";
import { publicProcedure } from "@/server/api/trpc";

const getBloggerPublicViewInput = z.object({
    bloggerId: z.string()
})

export const getBloggerPublicViewProceudre = publicProcedure
    .input(getBloggerPublicViewInput)
    .query(async ({ ctx, input }) => {
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            },
            select: {
                type: true,
                username: true,
                followersCount: true,
                prices: true,
            }
        })


        return blogger
    })
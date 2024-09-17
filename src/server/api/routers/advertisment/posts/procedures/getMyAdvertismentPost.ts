import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


export const getMyAdvertismentPostsProcedure = protectedProcedure
    .input(z.object({userId: z.string()}).optional())
    .query(async ({ ctx, input }) => {
        const myChannels = await ctx.db.advertismentPost.findMany({
            where: {
                creatorId: input?.userId ? input.userId : ctx.session.user.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return myChannels;
    })
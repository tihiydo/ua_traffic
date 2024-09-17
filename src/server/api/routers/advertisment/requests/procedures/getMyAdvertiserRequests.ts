import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


export const getMyAdvertiserRequestsProcedure = protectedProcedure
        .input(z.object({userId: z.string()}).optional())
        .query(async ({ ctx, input }) => {

        const advertismentPost = (await ctx.db.advertismentPost.findMany({
            where: {
                creatorId: input?.userId ? input.userId : ctx.session.user.id
            }
        }))

        const advertismentRequests  = (await ctx.db.advertismentRequest.findMany({
            where: {
                advertismentPostId: {
                    in: advertismentPost.map(post => post.id)
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                AdvertismentPost: true,
                Blogger: true,
                Chat: true,
                review: true,
            }
        }))

        

        return advertismentRequests;
    })
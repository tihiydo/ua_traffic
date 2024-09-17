import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";



export const getMyBloggersAdvertismentRequestsProcedure = protectedProcedure
    .input(z.object({userId: z.string()}).optional())
    .query(async ({ ctx, input }) => {
        const bloggers = await ctx.db.blogger.findMany({
            where: {
                userId: input?.userId ? input.userId : ctx.session.user.id
            },
            select: {
                id: true
            }
        })

        const advertisments = await ctx.db.advertismentRequest.findMany({
            where: {
                bloggerId: {
                    in: bloggers.map((blogger) => blogger.id)
                }
            },
            include: {
                Blogger: true,
                AdvertismentPost: true,
                Chat: true
            }
        });


        return advertisments;
    })
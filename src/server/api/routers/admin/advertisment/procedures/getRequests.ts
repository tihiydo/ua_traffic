import { moderProcedure } from "@/server/api/trpc";

export const getRequestsProcedure = moderProcedure
    .query(async ({ ctx }) => {
        return await ctx.db.advertismentRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                Blogger: true,
                AdvertismentPost: true
            }
        })
    })
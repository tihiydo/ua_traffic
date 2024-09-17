import { moderProcedure } from "@/server/api/trpc";
import { parseAdPost } from "@/database/ad-post/post";

export const getRequestsProcedure = moderProcedure
    .query(async ({ ctx }) => {
        const advRequests = await ctx.db.advertismentRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                Blogger: true,
                AdvertismentPost: true,
                Chat: true
            }
        })

        return advRequests.map(request => ({
            ...request,
            AdvertismentPost: parseAdPost(request.AdvertismentPost)
        }))
    })
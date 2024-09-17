import { protectedProcedure } from "@/server/api/trpc";
import { AdPostType } from "@/database/ad-post/post/post-types";
import { SocialType } from "@prisma/client";
import { z } from "zod";


const getOrderPostsInput = z.object({
    social: z.nativeEnum(SocialType),
    postType: z.nativeEnum(AdPostType).optional()
})

export const getOrderablePostsProcedure = protectedProcedure
    .input(getOrderPostsInput)
    .query(async ({ ctx, input }) => {
        const posts = await ctx.db.advertismentPost.findMany({
            where: {
                social: input.social,
                status: 'Accepted',
                creatorId: ctx.session.user.id,

                // All posts without type or with provided type
                OR: [
                    {
                        initialType: null,
                    },
                    {
                        initialType: input.postType
                    }
                ],
            },
            include: {
                AdvertismentRequest: {
                    select: {
                        id: true
                    }
                }
            }
        })

        return posts;
    })
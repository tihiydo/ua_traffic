import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

const getBloggerReviewsSchema = z.object({
    bloggerId: z.string(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10),
});

export const getBloggerReviewsProcedure = publicProcedure
    .input(getBloggerReviewsSchema)
    .query(async ({ ctx, input }) => {
        const skip = (input.page - 1) * input.limit;

        const [reviews, totalCount] = await Promise.all([
            ctx.db.bloggerReview.findMany({
                where: {
                    bloggerId: input.bloggerId,
                    status: 'Approved',
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: input.limit,
                include: {
                    advertiser: {
                        select: {
                            name: true,
                            image: true,
                            email: true,
                        },
                    },
                },
            }),
            ctx.db.bloggerReview.count({
                where: {
                    bloggerId: input.bloggerId,
                    status: 'Approved',
                },
            }),
        ]);

        return {
            reviews,
            totalCount,
            totalPages: Math.ceil(totalCount / input.limit),
        };
    });
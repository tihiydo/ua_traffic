import { adminProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const getReviewsProcedure = adminProcedure
    .input(
        z.object({
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(50).default(10),
            status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
        })
    )
    .query(async ({ ctx, input }) => {
        const { page, limit, status } = input;
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [reviews, totalCount] = await Promise.all([
            ctx.db.bloggerReview.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    blogger: true,
                    advertiser: true,
                },
            }),
            ctx.db.bloggerReview.count({ where }),
        ]);

        return {
            reviews,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        };
    });
import { adminProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { calculateRating } from '@/utils/calculateRating';

export const moderateReviewProcedure = adminProcedure
    .input(
        z.object({
            reviewId: z.string(),
            action: z.enum(['approve', 'reject']),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const { reviewId, action } = input;

        const review = await ctx.db.bloggerReview.findUnique({
            where: { id: reviewId },
            include: { blogger: true },
        });

        if (!review) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Review not found',
            });
        }

        if (review.status !== 'Pending') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'This review has already been moderated',
            });
        }

        const updatedReview = await ctx.db.bloggerReview.update({
            where: { id: reviewId },
            data: {
                status: action === 'approve' ? 'Approved' : 'Rejected',
            },
        });

        if (action === 'approve') {
            const newRating = calculateRating(review, review.blogger.rating);
            await ctx.db.blogger.update({
                where: { id: review.bloggerId },
                data: { rating: newRating },
            });
        }

        return updatedReview;
    });
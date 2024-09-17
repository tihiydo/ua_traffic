import { adminProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { calculateRating } from '@/utils/calculateRating';

export const editReviewProcedure = adminProcedure
    .input(z.object({
        reviewId: z.string(),
        professionalism: z.number().min(0).max(5).optional().nullable(),
        quality: z.number().min(0).max(5).optional().nullable(),
        price: z.number().min(0).max(5).optional().nullable(),
        communication: z.number().min(0).max(5).optional().nullable(),
        text: z.string().min(10).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
        const { reviewId, professionalism, quality, price, communication, text } = input;

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

        if (review.status !== 'Pending' && review.status !== 'Approved') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Review can only be edited when status is Pending or Approved',
            });
        }

        const updatedReview = await ctx.db.bloggerReview.update({
            where: { id: reviewId },
            data: {
                professionalism,
                quality,
                price,
                communication,
                text,
            },
        });

        if (review.status === 'Approved') {
            const oldImpact = (review.professionalism ?? 0) + (review.quality ?? 0) +
                (review.price ?? 0) + (review.communication ?? 0);

            const newImpact = (updatedReview.professionalism ?? 0) + (updatedReview.quality ?? 0) +
                (updatedReview.price ?? 0) + (updatedReview.communication ?? 0);

            const newRating = review.blogger.rating - oldImpact + newImpact;

            await ctx.db.blogger.update({
                where: { id: review.bloggerId },
                data: { rating: Math.max(0, Math.round(newRating)) },
            });
        }

        return updatedReview;
    });
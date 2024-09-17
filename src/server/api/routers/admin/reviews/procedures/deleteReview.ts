import { adminProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteReviewProcedure = adminProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const { reviewId } = input;

        const review = await ctx.db.bloggerReview.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Review not found',
            });
        }

        await ctx.db.bloggerReview.delete({
            where: { id: reviewId },
        });

        return { success: true };
    });
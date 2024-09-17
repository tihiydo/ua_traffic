import { adminProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const getReview = adminProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
        const review = await ctx.db.bloggerReview.findUnique({
            where: { id: input.reviewId },
            include: { blogger: true, advertiser: true },
        });
        if (!review) throw new TRPCError({ code: 'NOT_FOUND' });
        return review;
    })
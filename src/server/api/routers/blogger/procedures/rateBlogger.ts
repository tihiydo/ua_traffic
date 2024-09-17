import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ERROR_CODES } from "@/constants/error-codes";
import { calculateRating } from "@/utils/calculateRating";

const createReviewSchema = z.object({
    bloggerId: z.string(),
    requestId: z.string(),
    professionalism: z.number().min(0).max(5).optional(),
    quality: z.number().min(0).max(5).optional(),
    price: z.number().min(0).max(5).optional(),
    communication: z.number().min(0).max(5).optional(),
    text: z.string().min(10).max(500),
});

export const createReviewProcedure = protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
        if (ctx.session.user.selectedCabinet !== 'Advertiser') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: ERROR_CODES.NOT_ADVERTISER,
            });
        }

        const request = await ctx.db.advertismentRequest.findUnique({
            where: { id: input.requestId },
        });

        if (!request || request.status !== 'Done') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: ERROR_CODES.INVALID_REQUEST_STATUS,
            });
        }

        const existingReview = await ctx.db.bloggerReview.findFirst({
            where: {
                requestId: input.requestId,
                advertiserId: ctx.session.user.id,
            },
        });

        if (existingReview) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: ERROR_CODES.REVIEW_ALREADY_EXISTS,
            });
        }

        const newReview = await ctx.db.bloggerReview.create({
            data: {
                ...input,
                advertiserId: ctx.session.user.id,
                status: 'Pending',
            },
        });

        return newReview;
    });
import { ERROR_CODES } from "@/constants/error-codes";
import { parseBlogger } from "@/database/blogger";
import { parseBloggerPrices, PostPriceSchema } from "@/database/blogger/prices";
import { protectedProcedure } from "@/server/api/trpc";
import { calculateRating } from '@/utils/calculateRating';
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const discountSchema = z.object({
    type: z.enum(['percentage', 'static']),
    value: z.number()
});

const priceSchema = z.object({
    amount: z.number(),
    discount: z.object({
        type: z.enum(['percentage', 'static']),
        value: z.number()
    }).optional()
});

const updateBloggerSchema = z.object({
    bloggerId: z.string(),
    data: z.object({
        about: z.string(),
        prices: z.record(priceSchema.optional()),
        womenPercentage: z.number().min(0).max(100).optional(),
        menPercentage: z.number().min(0).max(100).optional(),
        ageCategory: z.string().optional(),
        cpm: z.number().optional(),
        cpv: z.number().optional(),
        channelAge: z.number().optional(),
    })
});

export const updateBloggerProcedure = protectedProcedure
    .input(updateBloggerSchema)
    .mutation(async ({ ctx, input }) => {
        console.log('Received data:', JSON.stringify(input.data, null, 2));
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId,
            },
            include: {
                reviews: true,
            },
        });

        if (!blogger) {
            throw new TRPCError({
                message: ERROR_CODES.NOT_YOUR_BLOGGER,
                code: 'NOT_FOUND'
            });
        };

        if (!blogger.userId || blogger.userId !== ctx.session.user.id) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: ERROR_CODES.NOT_YOUR_BLOGGER
            });
        };

        const prices = parseBloggerPrices(blogger.type, input.data.prices);
        if (!prices) {
            throw new TRPCError({
                code: 'PARSE_ERROR',
                message: ERROR_CODES.INVALID_BLOGGER_PRICES
            });
        }

        const currentRating = blogger.rating;

        const updatedBlogger = await ctx.db.blogger.update({
            where: {
                id: blogger.id
            },
            data: {
                ...input.data,
                prices,
                status: blogger.status === 'Declined' ? 'Moderating' : blogger.status,
                rating: currentRating, 
            },
            include: {
                reviews: true,
            }
        });

        return parseBlogger({ ...updatedBlogger, reviews: updatedBlogger.reviews });
    });
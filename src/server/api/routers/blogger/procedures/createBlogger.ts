import { protectedProcedure } from "@/server/api/trpc";
import { SocialType, BloggerStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ERROR_CODES } from "@/constants/error-codes";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { parseBloggerPrices, PostPriceSchema } from "@/database/blogger/prices";
import { categories } from "@/database/blogger/categories";

const createBloggerSchema = z.object({
    id: z.string(),
    userId: z.string().optional(),
    coverage: z.number().optional(),
    profileLink: z.string().optional(),
    fake: z.boolean().default(false),
    categories: z.array(createUnionSchema(categories)).optional(),
    username: z.string(),
    followersCount: z.number(),
    profilePicture: z.string(),
    type: z.nativeEnum(SocialType),
    status: z.nativeEnum(BloggerStatus),
    about: z.string(),
    prices: z.record(PostPriceSchema.optional()),
    womenPercentage: z.number().optional(),
    menPercentage: z.number().optional(),
    ageCategory: z.string().optional(),
    cpm: z.number().optional(),
    cpv: z.number().optional(),
    channelAge: z.number().optional(),
})

const fieldsForRating = (input: any) => {
    const requiredFields = ['about', 'prices','categories', 'cpm', 'cpv', 'channelAge', 'womenPercentage', 'menPercentage', 'ageCategory'];
    return requiredFields.every(field => input[field] !== undefined && input[field] !== null);

}

export const createBloggerProcedure = protectedProcedure
    .input(createBloggerSchema)
    .mutation(async ({ ctx, input }) => {

        const existingProfile = await ctx.db.blogger.findUnique({
            where: {
                id: input.id,
            }
        });

        if (existingProfile) {
            throw new TRPCError({
                message: ERROR_CODES.BLOGGER_EXISTS,
                code: 'BAD_REQUEST'
            })
        };

        // TODO: Parse whole blogger instead of only prices
        const prices = parseBloggerPrices(input.type, input.prices);
        if (!prices) {
            throw new TRPCError({
                code: 'PARSE_ERROR',
                message: ERROR_CODES.INVALID_BLOGGER_PRICES
            })
        }
        const rating = fieldsForRating(input) ? 500 : 0;
        const newBlogger = await ctx.db.blogger.create({
            data: {
                about: input.about,
                followersCount: input.followersCount,
                username: input.username,
                fake: input.fake,
                categories: input.categories ?? [],
                prices: input.prices,
                id: input.id,
                rating: rating,
                type: input.type,
                profilePicture: input.profilePicture,
                profileLink: input.profileLink,
                coverage: input.coverage ?? null,
                status: input.status || 'Moderating',
                userId: input.userId || ctx.session.user.id,
                womenPercentage: input.womenPercentage,
                menPercentage: input.menPercentage,
                ageCategory: input.ageCategory,
                cpm: input.cpm,
                cpv: input.cpv,
                channelAge: input.channelAge,
            },
        })

        if (input.type == "Telegram") {
            try {
                await ctx.db.telegramVerificationRequests.delete({
                    where: {
                        userId: ctx.session.user.id
                    }
                })
            } catch { }
        }

        return newBlogger
    });
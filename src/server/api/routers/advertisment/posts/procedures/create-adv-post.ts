import { protectedProcedure } from "@/server/api/trpc";
import { AdAttachementsSchema } from "@/database/ad-post/attachments";
import { AdPreviewSchema } from "@/database/ad-post/preview";
import { SocialType } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ERROR_CODES } from "@/constants/error-codes";

const createAdvertismentPayloadSchema = z.object({
    title: z.string(),
    type: z.string().optional(),
    content: z.string(),
    social: z.nativeEnum(SocialType),
    attachemnts: AdAttachementsSchema.default([]),
    preview: AdPreviewSchema
})

export const createAdvertismentPostProcedure = protectedProcedure
    .input(createAdvertismentPayloadSchema)
    .mutation(async ({ ctx, input }) => {
        if (ctx.session.user.advertiserBalance < 200) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.NOT_ENOUGHT_MONEY})
        }

        const newAdvertisment = await ctx.db.advertismentPost.create({
            data: {
                creatorId: ctx.session.user.id,
                content: input.content,
                title: input.title,
                initialType: input.type ?? null,
                social: input.social,
                attachments: input.attachemnts,
                preview: input.preview
            }
        })

        return newAdvertisment;
    })
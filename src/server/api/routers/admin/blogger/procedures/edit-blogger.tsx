import { parseBlogger } from "@/database/blogger";
import { categories } from "@/database/blogger/categories";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { moderProcedure } from "@/server/api/trpc";
import { BloggerTag } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const editBloggerInput = z.object({
    categories: z.array(createUnionSchema(categories)).optional(),
    tags: z.array(z.nativeEnum(BloggerTag)).optional(),
    bloggerId: z.string(),
    about: z.string(),
    womenPercentage: z.number().min(0).max(100).optional(),
    menPercentage: z.number().min(0).max(100).optional(),
    ageCategory: z.string().optional(),
    cpm: z.number().optional(),
    cpv: z.number().optional(),
    channelAge: z.number().optional(),
    rating: z.number().optional(),
})

export const editBloggerProcedure = moderProcedure
    .input(editBloggerInput)
    .mutation(async ({ ctx, input }) => {
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            }
        })

        if (!blogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Блогера не існує' })
        }

        const updatedBlogger = await ctx.db.blogger.update({
            where: {
                id: blogger.id
            },
            data: {
                tags: input.tags,
                categories: input.categories,
                about: input.about,
                womenPercentage: input.womenPercentage,
                menPercentage: input.menPercentage,
                ageCategory: input.ageCategory,
                cpm: input.cpm,
                cpv: input.cpv,
                channelAge: input.channelAge,
                rating: input.rating
            }
        })

        return parseBlogger(updatedBlogger);
    })
import { adminProcedure, moderProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { BloggerTag } from "@prisma/client";
import { parseBlogger } from "@/database/blogger";
import { categories } from "@/database/blogger/categories";


const acceptBloggerInput = z.object({
    categories: z
        .array(createUnionSchema(categories))
        .min(1)
        .transform(value => {
            return Array.from(new Set(value));
        }),
    tags: z.array(z.nativeEnum(BloggerTag)).optional(),
    bloggerId: z.string(),
    about: z.string(),
    womenPercentage: z.number().optional(),
    menPercentage: z.number().optional(),
    ageCategory: z.string().optional(),
    cpm: z.number().optional(),
    cpv: z.number().optional(),
    channelAge: z.number().optional(),
})

export const acceptBloggerProcedure = moderProcedure
    .input(acceptBloggerInput)
    .mutation(async ({ ctx, input }) => {
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            }
        });

        if (!blogger) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: 'Блогера не знайдено'
            })
        };

        const moderatedBlogger = await ctx.db.blogger.update({
            where: {
                id: input.bloggerId
            },
            data: {
                status: 'Inactive',
                categories: input.categories,
                tags: input.tags,
                about: input.about,
                womenPercentage: input.womenPercentage,
                menPercentage: input.menPercentage,
                ageCategory: input.ageCategory,
                cpm: input.cpm,
                cpv: input.cpv,
                channelAge: input.channelAge,
            },
            include: {
                User: {
                    select: {
                        email: true
                    }
                }
            }
        })

        return parseBlogger(moderatedBlogger)
    })
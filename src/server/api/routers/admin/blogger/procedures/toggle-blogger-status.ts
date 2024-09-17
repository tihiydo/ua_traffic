import { parseBlogger } from "@/database/blogger";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { adminProcedure, moderProcedure } from "@/server/api/trpc";
import { BloggerStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const toggleBloggerStatusInput = z.object({
    bloggerId: z.string(),
    newStatus: createUnionSchema([BloggerStatus.Inactive, BloggerStatus.Active])
})

export const toggleBloggerStatus = moderProcedure
    .input(toggleBloggerStatusInput)
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
                status: input.newStatus,
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
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const toggleSaveBlogger = protectedProcedure
    .input(z.object({ bloggerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const findSaved = await ctx.db.savedBloggers.findFirst({
            where: {
                bloggerId: input.bloggerId,
                userId: ctx.session.user.id
            }
        })

        if (findSaved != null) {
            await ctx.db.savedBloggers.delete({
                where: {
                    id: findSaved.id
                }
            })

            return {
                isSaved: false,
                bloggerId: input.bloggerId
            }
        } else {
            const newSave = await ctx.db.savedBloggers.create({
                data: {
                    bloggerId: input.bloggerId,
                    userId: ctx.session.user.id
                }
            })

            return {
                isSaved: true,
                bloggerId: input.bloggerId
            }
        }
    })
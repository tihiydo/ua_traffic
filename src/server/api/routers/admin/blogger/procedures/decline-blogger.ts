import { parseBlogger } from "@/database/blogger";
import { adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const declineBloggerInput = z.object({
    declineMessage: z.string(),
    bloggerId: z.string()
})

export const declineBloggerProcedure = adminProcedure
    .input(declineBloggerInput)
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
                status: 'Declined',
                declinedMessage: input.declineMessage
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
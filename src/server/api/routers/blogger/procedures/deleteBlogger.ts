import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const deleteBloggerSchema = z.object({ bloggerId: z.string() })

export const deleteBloggerProcedure = protectedProcedure
    .input(deleteBloggerSchema)
    .mutation(async ({ ctx, input }) => {
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            }
        })

        if (!blogger) {
            throw new TRPCError({ code: "NOT_FOUND", message: ERROR_CODES.BLOGGER_NOT_FOUND })
        }

        if (blogger.userId !== ctx.session.user.id) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: ERROR_CODES.NOT_YOUR_BLOGGER
            })
        }

        await ctx.db.blogger.delete({
            where: {
                id: blogger.id,
            }
        });

        return blogger.id
    })
import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const changeEmailInput = z.object({
    token: z.string(),
})

export const changeEmailProcedure = protectedProcedure
    .input(changeEmailInput)
    .mutation(async ({ ctx, input }) => {
        const token = await ctx.db.verificationToken.findFirst({
            where: {
                token: input.token
            }
        })

        if (!token) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: ERROR_CODES.ANY_TOKEN_NOT_FOUND
            })
        }

        if (token.expires.getTime() < new Date().getTime()) {
            throw new TRPCError({
                message: ERROR_CODES.TOKEN_EXPIRED,
                code: "BAD_REQUEST",
            });
        }


        const isTaken = (await ctx.db.user.findFirst({
            where: {
                email: token.identifier
            },
            select: {
                email: true
            }
        }))!!

        if (isTaken) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: ERROR_CODES.EMAIL_IN_USE
            })
        }

        return await ctx.db.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                email: token.identifier
            }
        })
    })


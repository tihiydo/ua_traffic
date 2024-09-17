import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { getVerificationToken } from "../token";
import { TRPCError } from "@trpc/server";
import { ERROR_CODES } from "@/constants/error-codes";
import { sendChangeEmailEmail } from "../emails/change-email-email";

const sendChangeEmailEmailInput = z.object({
    email: z.string()
})

export const sendChangeEmailEmailProcedure = protectedProcedure
    .input(sendChangeEmailEmailInput)
    .mutation(async ({ ctx, input }) => {
        const isTaken = (await ctx.db.user.findFirst({
            where: {
                email: input.email    
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

        const token = await getVerificationToken(input.email);
        if (!token) {
            throw new TRPCError({code: 'BAD_REQUEST', message: ERROR_CODES.SERVER_ERROR })
        }

        await sendChangeEmailEmail(input.email, token?.token);

        return {
            email: input.email
        }
    })
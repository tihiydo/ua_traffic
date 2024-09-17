import { ERROR_CODES } from "@/constants/error-codes";
import { requestPaymentURL } from "@/lib/ipsp";
import { requestMonobankPaymentURL } from '@/lib/monobank';
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";

const requestDepositSchema = z.object({
    amount: z.number(),
})

export const requestDepositProcedure = protectedProcedure
    .input(requestDepositSchema)
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id
            }
        })

        if (!user) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.USER_NOT_FOUND })
        }

        const hasRefferals = (await ctx.db.referrals.findMany({
            where:
            {
                inviterUserId: ctx.session.user.id
            }
        })).length >= 1

        const depositFee = (await ctx.db.adminFee.findUnique({
            where: {
                type: "Deposit"
            }
        }))?.fee ?? 0

        const referalBonus = (await ctx.db.adminFee.findUnique({
            where: {
                type: "Bonus"
            }
        }))?.fee ?? 0

        const realAmount = hasRefferals
            ? input.amount * (((100 - depositFee) / 100) + ((referalBonus) / 100))
            : input.amount * ((100 - depositFee) / 100)

        const transaction = await ctx.db.depositTransaction.create({
            data: {
                amount: input.amount,
                realAmount: realAmount,
                userId: user.id,
            }
        })

        const paymentResponse = await requestMonobankPaymentURL({
            amount: input.amount * 100, // Ensure this is a string
        });


        await ctx.db.depositTransaction.update({
            where: {
                id: transaction.id
            },
            data: {
                paymentUrl: paymentResponse.pageUrl,
                invoiceId: paymentResponse.invoiceId
            }
        })

        return paymentResponse;
    })




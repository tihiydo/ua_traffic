import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createTransactionSchema = z.object({
    amount: z.number(),
    cardNumber: z.string(),
})

export const createTransactionProcedure = protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {


        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id
            }
        })

        const requisites = await ctx.db.requisites.findUnique({
            where: {
                cardNumber: input.cardNumber
            }
        })

        if (!requisites) {
            throw new TRPCError({ code: 'FORBIDDEN', message: ERROR_CODES.USER_NOT_FOUND })
        }

        if (!user) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.USER_NOT_FOUND })
        }

        if (user.bloggerBalance < input.amount) {
            throw new TRPCError({ code: 'FORBIDDEN', message: ERROR_CODES.NOT_ENOUGHT_MONEY })
        }


        const fee = await ctx.db.adminFee.findUnique({
            where: {
                type: "Widthdraw"
            }
        })

        let feeNum;

        if (typeof fee?.fee != "number") {
            feeNum = 0
        } else {
            feeNum = fee.fee
        }

        const transactionResult = await ctx.db.$transaction([
            ctx.db.withdrawTransaction.create({
                data: {
                    amount: input.amount,
                    realAmount: input.amount * ((100 - feeNum) / 100),
                    cardNumber: input.cardNumber,
                    cardBank: requisites.cardBank,
                    fio: requisites.fio,
                    userId: ctx.session.user.id
                }
            }),
            ctx.db.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    bloggerBalance: {
                        decrement: input.amount,
                    },
                    toWithdraw: {
                        increment: input.amount * ((100 - feeNum) / 100)
                    }
                }
            })
        ])

        return transactionResult[0]
    })
import { moderProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const markAsDoneSchema = z.object({
    transactionId: z.string(),
})


export const markAsDoneProcedure = moderProcedure
    .input(markAsDoneSchema)
    .mutation(async ({ ctx, input }) => {
        const transaction = await ctx.db.withdrawTransaction.findUnique({
            where: {
                id: input.transactionId
            }
        });

        if (!transaction) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Заявку не знайдено'})
        }

        if (transaction.status !== 'Processing') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Ця заявка вже була оброблена'})
        }

        await ctx.db.$transaction([
            ctx.db.withdrawTransaction.update({
                where: {
                    id: transaction.id
                },
                data: {
                    status: 'Done' 
                }
            }),
            ctx.db.user.update({
                where: {
                    id: transaction.userId
                },
                data: {
                    toWithdraw: {
                        decrement: transaction.realAmount
                    },
                    totalWithdrawed: {
                        increment: transaction.realAmount
                    },
                }
            })
        ])
    })
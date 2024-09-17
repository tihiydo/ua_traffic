import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";




export const getMyTransactionsProcedure = protectedProcedure
    .input(z.object({userId: z.string()}).optional())
    .query(async ({ ctx, input }) => {
        const myTransactions = await ctx.db.withdrawTransaction.findMany({
            where: {
                userId: input?.userId ? input.userId : ctx.session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return myTransactions;
    })
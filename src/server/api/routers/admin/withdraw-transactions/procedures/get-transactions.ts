import { moderProcedure } from "@/server/api/trpc";



export const getTransactionsProcedure = moderProcedure
    .query(async ({ ctx }) => {
        return await ctx.db.withdrawTransaction.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    })
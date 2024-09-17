import { moderProcedure } from "@/server/api/trpc";
import { type BloggerHistoryItem, BloggerTransactionType } from "@/types/history/blogger";
import { z } from "zod";

const getHistoryInput = z.object({
    userId: z.string()
})

export const getHistoryProcedure = moderProcedure
    .input(getHistoryInput)
    .query(async ({ ctx, input }) => {
        const adTransactions = (await ctx.db.adRequestTransaction.findMany({
            where: {
                Request: {
                    Blogger: {
                        userId: input.userId
                    }
                }
            },
            include: {
                Request: {
                    include: {
                        AdvertismentPost: true
                    }
                }
            }
        }))
            // Add type field to distinguish transactions
            .map(val => ({
                ...val,
                type: BloggerTransactionType.Request,
            }))


        const depositTransactions = (await ctx.db.withdrawTransaction.findMany({
            where: {
                userId: input.userId
            }
        }))
            // Add type field to distinguish transactions
            .map(val => ({
                ...val,
                type: BloggerTransactionType.Withdraw,
            }))

        const transactions = [...adTransactions, ...depositTransactions].sort((transaction1, transaction2) => {
            return transaction2.createdAt.getTime() - transaction1.createdAt.getTime();
        }) satisfies BloggerHistoryItem[];

        return transactions;
    })
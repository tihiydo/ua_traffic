import { protectedProcedure } from "@/server/api/trpc";
import { type AdvertiserHistoryItem, AdvertiserTransactionType } from "@/types/history/advertiser";
import { z } from "zod";

const getHistoryInput = z.object({
    userId: z.string()
})

export const getHistoryProcedure = protectedProcedure
    .input(getHistoryInput)
    .query(async ({ ctx, input }) => {
        const adTransactions = (await ctx.db.adRequestTransaction.findMany({
            where: {
                Request: {
                    AdvertismentPost: {
                        creatorId: input.userId
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
                type: AdvertiserTransactionType.Request,
            }))


        const depositTransactions = (await ctx.db.depositTransaction.findMany({
            where: {
                userId: input.userId
            }
        }))
            // Add type field to distinguish transactions
            .map(val => ({
                ...val,
                type: AdvertiserTransactionType.Deposit,
            }))

        const transactions = [...adTransactions, ...depositTransactions].sort((transaction1, transaction2) => {
            return transaction2.createdAt.getTime() - transaction1.createdAt.getTime();
        }) satisfies AdvertiserHistoryItem[];

        return transactions;
    })
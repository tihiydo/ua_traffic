import { protectedProcedure } from "@/server/api/trpc";
import { type AdvertiserHistoryItem, AdvertiserTransactionType } from "@/types/history/advertiser";

export const getMyHistoryProcedure = protectedProcedure
    .query(async ({ ctx }) => {
        const adTransactions = (await ctx.db.adRequestTransaction.findMany({
            where: {
                Request: {
                    AdvertismentPost: {
                        creatorId: ctx.session.user.id
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
                userId: ctx.session.user.id
            }
        }))
            // Add type field to distinguish transactions
            .map(val => ({
                ...val,
                type: AdvertiserTransactionType.Deposit,
            }))

        const transferTransactions = (await ctx.db.transferTransaction.findMany({
            where: {
                userId: ctx.session.user.id
            }
        }))
            .map(val => ({
                ...val,
                type: AdvertiserTransactionType.Transfer,
            }))

        const transactions = [...adTransactions, ...depositTransactions, ...transferTransactions].sort((transaction1, transaction2) => {
            return transaction2.createdAt.getTime() - transaction1.createdAt.getTime();
        }) satisfies AdvertiserHistoryItem[];

        return transactions;
    })
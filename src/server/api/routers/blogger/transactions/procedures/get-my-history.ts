import { protectedProcedure } from "@/server/api/trpc";
import { type BloggerHistoryItem, BloggerTransactionType } from "@/types/history/blogger";

export const getMyHistoryProcedure = protectedProcedure
    .query(async ({ ctx }) => {
        const adTransactions = (await ctx.db.adRequestTransaction.findMany({
            where: {
                Request: {
                    Blogger: {
                        userId: ctx.session.user.id
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
                userId: ctx.session.user.id
            }
        }))
            // Add type field to distinguish transactions
            .map(val => ({
                ...val,
                type: BloggerTransactionType.Withdraw,
            }))

        const transferTransactions = (await ctx.db.transferTransaction.findMany({
            where: {
                userId: ctx.session.user.id
            }
        }))
            .map(val => ({
                ...val,
                type: BloggerTransactionType.Transfer,
            }))


        const transactions = [...adTransactions, ...depositTransactions, ...transferTransactions].sort((transaction1, transaction2) => {
            return transaction2.createdAt.getTime() - transaction1.createdAt.getTime();
        }) satisfies BloggerHistoryItem[];

        return transactions;
    })
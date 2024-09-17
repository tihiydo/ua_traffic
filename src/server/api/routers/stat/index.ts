import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const statRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx, input }) => {
            const getUsersCount = (await ctx.db.user.aggregate({ _count: { id: true } }))._count.id
            const depositTransactionCount = ((await ctx.db.depositTransaction.aggregate({ _sum: { amount: true } }))._sum.amount) || 0
            const withdrawTransactionCount = ((await ctx.db.withdrawTransaction.aggregate({ _sum: { amount: true } }))._sum.amount) || 0
            const IGBloggersCount = await ctx.db.blogger.count({ where: { type: 'Instagram' } })
            const TGBloggersCount = await ctx.db.blogger.count({ where: { type: 'Telegram' } })

            return {
                users: getUsersCount,
                deposit: depositTransactionCount,
                withdraw: withdrawTransactionCount,
                instagram: IGBloggersCount,
                telegram: TGBloggersCount,
            }
        })
})
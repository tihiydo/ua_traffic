import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";



export const getMyTransactionsProcedure = protectedProcedure
    .input(z.object({userId: z.string()}).optional())
    .query(async ({ input, ctx }) => {
        return await ctx.db.depositTransaction.findMany({
            where: {
                userId: input?.userId ? input.userId : ctx.session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    })
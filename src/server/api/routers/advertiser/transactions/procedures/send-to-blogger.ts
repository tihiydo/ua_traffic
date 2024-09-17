
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const transferMoneyProcedure = protectedProcedure
    .input(z.object({
        amount: z.number().positive(),
        amountAfterFee: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.advertiserBalance < input.amount) {
            throw new Error("Insufficient funds in advertiser account");
        }

        const updatedUser = await ctx.db.user.update({
            where: { id: user.id },
            data: {
                advertiserBalance: { decrement: input.amount },
                bloggerBalance: { increment: input.amountAfterFee },
            },
        });

        await ctx.db.transferTransaction.create({
            data: {
                userId: user.id,
                amount: input.amount,
                amountAfterFee: input.amountAfterFee,
                fromAccount: 'advertiser',
                toAccount: 'blogger',
            }
        });

        return updatedUser;
    });
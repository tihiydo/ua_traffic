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

        if (user.bloggerBalance < input.amount) {
            throw new Error("Insufficient funds in blogger account");
        }

        const updatedUser = await ctx.db.user.update({
            where: { id: user.id },
            data: {
                bloggerBalance: { decrement: input.amount },
                advertiserBalance: { increment: input.amountAfterFee },
            },
        });

        await ctx.db.transferTransaction.create({
            data: {
                userId: user.id,
                amount: input.amount,
                amountAfterFee: input.amountAfterFee,
                fromAccount: 'blogger',
                toAccount: 'advertiser',
            }
        });

        return updatedUser;
    });
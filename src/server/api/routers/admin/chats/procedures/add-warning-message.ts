import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

const checkMessage = z.object({
    content: z.string(),
    chatId: z.string()
})

export const addWarningMessage = publicProcedure
    .input(checkMessage)
    .mutation(async ({ input, ctx }) => {
        const { content, chatId } = input;
        if (!ctx.session || !ctx.session.user) {
            throw new Error("User is not authenticated");
        }
        const userId = ctx.session.user.id;

        await ctx.db.warningMessages.create({
            data: {
                message: content,
                chatId,
                userId
            }
        })

        return { success: true }
    })
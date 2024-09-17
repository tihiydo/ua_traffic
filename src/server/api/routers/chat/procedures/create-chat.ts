import { protectedProcedure } from "@/server/api/trpc"
import { z } from "zod"


const createChatInput = z.object({
    requestId: z.string()
})

export const createChatProcedure = protectedProcedure
    .input(createChatInput)
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.chat.upsert({
            where: {
                advertismentRequestId: input.requestId
            },
            create: {
                advertismentRequestId: input.requestId
            },
            update: {}
        })
    })
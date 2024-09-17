import { protectedProcedure } from "@/server/api/trpc";

export const deleteMyVerifRequest = protectedProcedure
    .mutation(async ({ ctx }) => {
        const existingRequest = await ctx.db.telegramVerificationRequests.findFirst({
            where: {
                userId: ctx.session.user.id
            },
            select: {
                verifiedChannelId: true
            }
        })

        if (!existingRequest?.verifiedChannelId) return;

        await ctx.db.telegramVerificationRequests.delete({
            where: {
                userId: ctx.session.user.id
            }
        })
    })
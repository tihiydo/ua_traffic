import { protectedProcedure } from "@/server/api/trpc";
import { getPhotoLink } from "../utils/getPhotoLink";

export type TelegramProfile = {
    channelId: string;
    title?: string | null,
    username?: string | null,
    followersCount?: number | null,
    photoUrl?: string | null,
    coverage?: number | null
}

export const getMyTelegramProfileProcedure = protectedProcedure
    .query(async ({ ctx }) => {
        const existingTelegramVerificationRequest = await ctx.db.telegramVerificationRequests.findUnique({
            where:
            {
                userId: ctx.session.user.id,
                verifiedChannelId: {
                    not: null
                }
            }
        })

        if (!existingTelegramVerificationRequest?.verifiedChannelId) return null

        if(existingTelegramVerificationRequest.createdAt.getTime() + 600000 <= new Date().getTime())
        {
            await ctx.db.telegramVerificationRequests.delete({where: {userId: ctx.session.user.id}})
            return null
        }
    
        const { title, channelMembers, coverageCount, username, verifiedChannelId } = existingTelegramVerificationRequest;

        const photoUrl = existingTelegramVerificationRequest.profilePhotoTelegramId
            ? await getPhotoLink(existingTelegramVerificationRequest.profilePhotoTelegramId)
            : ""

        return {
            title,
            coverage: coverageCount,
            username,
            followersCount: channelMembers,
            channelId: verifiedChannelId,
            photoUrl: photoUrl || ''

        } satisfies TelegramProfile
    })
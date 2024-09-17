import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { createShortLivedToken } from "../utils/create-short-lived-token";
import { createLongLivedToken } from "../utils/create-long-lived-token";

const createAccessTokenInput = z.object({
    code: z.string()
})

export const createAccessTokenProcedure = protectedProcedure
    .input(createAccessTokenInput)
    .mutation(async ({ input, ctx }) => {
        const shortLivedToken = await createShortLivedToken(input.code);
        const longLivedToken = await createLongLivedToken(shortLivedToken.access_token)
        const existingAccessToken = await ctx.db.iGAccessToken.findUnique({
            where: { profileId: shortLivedToken.user_id.toString() },
        })

        if (!existingAccessToken) {
            const accessToken = await ctx.db.iGAccessToken.create({
                data: {
                    profileId: shortLivedToken.user_id.toString(),
                    expires: formatExpiresSecondsToDate(longLivedToken.expires_in),
                    token: longLivedToken.access_token
                }
            });

            return accessToken
        }

        const updatedAccessToken = await ctx.db.iGAccessToken.update({
            where: {
                profileId: shortLivedToken.user_id.toString()
            },
            data: {
                token: longLivedToken.access_token,
                expires: formatExpiresSecondsToDate(longLivedToken.expires_in),
            }
        })

        return updatedAccessToken
    })

const formatExpiresSecondsToDate = (seconds: number) => {
    return new Date(Date.now() + (seconds * 1000));
}

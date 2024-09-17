import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getIGProfileData } from "./utils/profile";
import { createAccessTokenProcedure } from "./procedures/create-access-token";
import { ERROR_CODES } from "@/constants/error-codes";


export const instagramRouter = createTRPCRouter({
    createAccessToken: createAccessTokenProcedure,

    getIGData: protectedProcedure
        .input(z.object({
            profileId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userAccessToken = await ctx.db.iGAccessToken.findUnique({
                where: {
                    profileId: input.profileId,
                }
            });
            if (!userAccessToken) {
                throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.IG_TOKEN_NOT_FOUND })
            }

            const instagramProfileData = await getIGProfileData(userAccessToken.token);

            return instagramProfileData;
        }),
})

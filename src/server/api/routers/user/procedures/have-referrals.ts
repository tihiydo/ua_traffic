import { locales } from "@/i18n/config";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


export const haveReferrals = protectedProcedure
    .query(async ({ ctx }) =>
    {
        const result = (await ctx.db.referrals.findMany({where:
        {
            inviterUserId: ctx.session.user.id
        }})).length >= 1
        
        return result
    })
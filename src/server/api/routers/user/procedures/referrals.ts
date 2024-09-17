import { locales } from "@/i18n/config";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


export const getUserReferrals = protectedProcedure
    .query(async ({ ctx }) =>
    {
        const result = ctx.db.referrals.findMany({where:
        {
            inviterUserId: ctx.session.user.id
        }})
        return result
    })
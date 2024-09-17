import { locales } from "@/i18n/config";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


const changeLocaleInput = z.object({
    locale: createUnionSchema(locales)
})

export const changeLocaleProcedure = protectedProcedure
    .input(changeLocaleInput)
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                preferedLocale: input.locale
            },
            select: {
                preferedLocale: true
            }
        })
    })
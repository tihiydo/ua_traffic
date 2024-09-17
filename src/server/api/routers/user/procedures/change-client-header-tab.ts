import { locales } from "@/i18n/config";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { Cabinet } from "@prisma/client";

export const changeClientHeaderTab = protectedProcedure
    .input(z.object({cabinet: z.nativeEnum(Cabinet)}))
    .mutation(async ({ ctx, input }) =>
    {
        const user = await ctx.db.user.update
        ({
            where: 
            {
                id: ctx.session.user.id
            },
            data:
            {
                selectedCabinet: input.cabinet
            }
        })

        return user.selectedCabinet
    })
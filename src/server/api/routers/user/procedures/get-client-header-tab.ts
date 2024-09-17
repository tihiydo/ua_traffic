import { locales } from "@/i18n/config";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { Cabinet } from "@prisma/client";

export const getClientHeaderTab = protectedProcedure
    .query(async ({ ctx }) =>
    {
        const user = await ctx.db.user.findUnique
        ({
            where: 
            {
                id: ctx.session.user.id
            },
            select:
            {
                selectedCabinet: true
            }
        })

        return user?.selectedCabinet
    })
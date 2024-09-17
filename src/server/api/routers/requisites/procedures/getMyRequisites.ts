import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const getMyRequisitesProcedure = protectedProcedure
    .input(z.object({userId: z.string()}).optional())
    .query(async ({ ctx, input }) => {
        const requisites = await ctx.db.requisites.findMany({
            where: {
                userId: input?.userId ? input.userId : ctx.session.user.id
            }
        })

        return requisites
    })
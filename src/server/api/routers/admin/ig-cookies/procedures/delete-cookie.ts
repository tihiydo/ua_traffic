import { moderProcedure } from "@/server/api/trpc";
import { z } from "zod";


const deleteCookieInput = z.object({
    id: z.string()
})

export const deleteCookieProcedure = moderProcedure
    .input(deleteCookieInput)
    .mutation(async ({ ctx, input }) => {
        await ctx.db.iGCookie.delete({
            where: {
                id: input.id
            }
        })
    })
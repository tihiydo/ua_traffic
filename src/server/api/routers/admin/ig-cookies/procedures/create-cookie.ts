import { moderProcedure } from "@/server/api/trpc";
import { z } from "zod";


const createCookieInput = z.object({
    value: z.string(),
    name: z.string(),
    username: z.string()
})

export const createCookieProcedure = moderProcedure
    .input(createCookieInput)
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.iGCookie.create({
            data: {
                name: input.name,
                value: input.value,
                username: input.username
            }
        })
    })
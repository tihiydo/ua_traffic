import {  moderProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const updateCookieInput = z.object({
    id: z.string(),
    value: z.string().optional(),
    name: z.string().optional()
})

export const updateCookieProcedure = moderProcedure
    .input(updateCookieInput)
    .mutation(async ({ ctx, input }) => {
        const cookie = await ctx.db.iGCookie.findUnique({
            where: {
                id: input.id
            },
            select: {
                id: true,
                status: true
            }
        })

        if (!cookie) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Cookie не знайдено'
            })
        }

        return await ctx.db.iGCookie.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                value: input.value,
                status: cookie.status === 'Paused' ? 'Paused' : 'Active'
            }
        })
    })
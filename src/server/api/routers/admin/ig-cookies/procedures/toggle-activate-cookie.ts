import { moderProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


const toggleActiveCookieInput = z.object({
    id: z.string(),
})

export const toggleActiveCookieProcedure = moderProcedure
    .input(toggleActiveCookieInput)
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

        if (cookie.status !== 'Active' && cookie.status !== 'Paused') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Неможливо переключити статус Cookie яке знаходиться в статусі ${cookie.status}`
            })
        }


        return await ctx.db.iGCookie.update({
            where: {
                id: input.id
            },
            data: {
                status: cookie.status === 'Active' ? 'Paused' : 'Active'
            }
        })
    })
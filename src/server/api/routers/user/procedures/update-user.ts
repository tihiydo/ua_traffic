import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const updateUserSchema = z.object({
    name: z.string().optional(),
    tel: z.string().optional(),
    telegram: z.string().optional(),
})


export const udpateUserProcedure = protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id
            }
        });

        if (!user) {
            throw new TRPCError({ code: "NOT_FOUND", message: ERROR_CODES.USER_NOT_FOUND })
        }

        // Insure telephone is not in use
        if (input.tel !== user.tel) {
            const telUser = await db.user.findUnique({
                where: {
                    tel: input.tel
                }
            })

            if (telUser) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: ERROR_CODES.TEL_IN_USE,
                })
            }
        }

        return await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                name: input.name ?? user.name,
                tel: input.tel ?? user.tel,
                telegram: input.telegram ?? user.telegram,
            }
        })
    })
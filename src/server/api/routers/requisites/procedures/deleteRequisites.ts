import { ERROR_CODES } from "@/constants/error-codes";
import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const deleteRequisitesSchema = z.object({
    requisitesId: z.string()
})

export const deleteRequisitesProcedure = protectedProcedure
    .input(deleteRequisitesSchema)
    .mutation(async ({ ctx, input}) => {
        const requisites = await ctx.db.requisites.findUnique({
            where: {
                id: input.requisitesId
            }
        });

        if (!requisites) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.REQUISITES_NOT_FOUND })
        }

        if (requisites.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: ERROR_CODES.NOT_YOUR_REQUISITES })
        }

        await ctx.db.requisites.delete({
            where: {
                id: requisites.id
            }
        })
    })
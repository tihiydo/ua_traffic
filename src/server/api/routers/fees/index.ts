import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../../trpc";
import { FeeType } from "@prisma/client";

export const feesRouter = createTRPCRouter
({
    getFee: protectedProcedure
        .input(z.object({type: z.nativeEnum(FeeType)}))
        .query(async ({ ctx, input }) => {
            const fee = await ctx.db.adminFee.findUnique({where: {
                type: input.type
            }})
            if(typeof fee?.fee == "number") {
                return fee.fee
            }

            return 0
        }),
    updateFee: adminProcedure
        .input(z.object({newFee: z.number(), type: z.nativeEnum(FeeType)}))
        .mutation(async ({ input, ctx }) => {
            const update = await ctx.db.adminFee.upsert(
                {
                    where: 
                {
                    type: input.type
                },
                    update: 
                {
                    fee: Math.round( input.newFee * 1e2 ) / 1e2
                },
                    create:
                {
                    type: input.type,
                    fee: Math.round( input.newFee * 1e2 ) / 1e2
                }}
            )
            return update
        })
})
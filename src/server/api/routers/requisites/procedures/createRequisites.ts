import { protectedProcedure } from "@/server/api/trpc";
import { CardBank } from "@prisma/client";
import { z } from "zod";

const createRequisitesSchema = z.object({
    card: z.string(),
    fio: z.string(),
    cardBank: z.nativeEnum(CardBank)
}) 

export const createRequisitesProcedure = protectedProcedure
    .input(createRequisitesSchema)
    .mutation(async ({ ctx, input }) => {
        const requisites = await ctx.db.requisites.create({
            data: {
                userId: ctx.session.user.id,
                cardNumber: input.card,
                fio: input.fio,
                cardBank: input.cardBank
            }
        })

        return requisites;
    })
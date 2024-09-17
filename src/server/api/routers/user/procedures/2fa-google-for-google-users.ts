import { protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TOTP } from 'otpauth';

export const setEnteredTwoFaForGoogleUsers = publicProcedure
.input(z.object({email: z.string(), entered: z.boolean()}))
.mutation(async ({ ctx, input }) => 
{
    const update = await ctx.db.user.update
    ({
        where: 
        {
            email: input.email
        },
        data:
        {
            twofaGoogleForGoogleUsersIsChecked: input.entered
        }
    })
})
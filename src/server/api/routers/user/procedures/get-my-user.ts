import { protectedProcedure } from "@/server/api/trpc"
import { excludeKeys } from "@/utils"
import { type User } from "@prisma/client"
import { z } from "zod"

export type GetMyUserData = Omit<User, 'password'> & {
    isNative: boolean
}

export const getMyUserProcedure = protectedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ ctx, input }) => {

        const dangerousUser = await ctx.db.user.findUnique({
            where: {
                id: input?.userId ? input.userId : ctx.session.user.id
            },
            include: {
                accounts: {
                    select: {
                        provider: true,
                        type: true
                    }
                },
            }
        })

        if (!dangerousUser) return;

        const user = excludeKeys(['password'], dangerousUser);


        return {
            ...user,
            isNative: !dangerousUser.accounts.length && !!dangerousUser.password && !!dangerousUser.email
        } satisfies GetMyUserData
    })
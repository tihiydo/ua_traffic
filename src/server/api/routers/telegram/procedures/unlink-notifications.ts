import { protectedProcedure } from "@/server/api/trpc";
import { excludeKeys } from "@/utils";
import { GetMyUserData } from "../../user/procedures/get-my-user";

export const unlinkNotificationProcedures = protectedProcedure
    .mutation(async ({ ctx }) => 
    {
        const dangerousUser = await ctx.db.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                telegram: null
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
import { protectedProcedure } from "@/server/api/trpc"
import { excludeKeys } from "@/utils"

export const verificateTelegram = protectedProcedure
.mutation(async ({ ctx }) => 
{
    const isExists = await ctx.db.telegramVerificationNotifyRequest.findUnique
    ({
        where:
        {
            userId: ctx.session.user.id
        }
    })

    if(isExists)
    {
        await ctx.db.telegramVerificationNotifyRequest.delete({
            where:
            {
                startKey: isExists.startKey
            }
        })
    }

    const key = Math.random().toString(36).slice(2, 8 + 2)
    await ctx.db.telegramVerificationNotifyRequest.create
    ({
        data:
        {
            userId: ctx.session.user.id,
            startKey: key
        }
    })

    return key
})

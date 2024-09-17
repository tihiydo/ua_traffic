import { publicProcedure } from "@/server/api/trpc"

export const getUserBlock = publicProcedure
    .query(async ({ ctx }) => 
    {
        if(ctx.session)
        {
            const user = await ctx.db.user.findUnique
            ({
                where: 
                {
                    id: ctx.session.user.id
                },
                select:
                {
                    banned: true
                }
            })
            if(user !== null)
            {
                if(user.banned)
                {
                    return true;
                }
                else
                {
                    return false
                }
            }
            else
            {
                return null
            }
        }
})
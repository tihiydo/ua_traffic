import { protectedProcedure } from "@/server/api/trpc"

export const removeUser = protectedProcedure
    .mutation(async ({ ctx }) => 
    {
        if(ctx.session)
        {
            const user = await ctx.db.user.delete
            ({
                where: 
                {
                    id: ctx.session.user.id
                }
            })
            return true
        }
})
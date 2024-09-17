import { protectedProcedure } from "@/server/api/trpc";

export const getSavedBloggers = protectedProcedure
.mutation(async ({ ctx }) => 
{
    const saved = await ctx.db.savedBloggers.findMany
    ({
        where: 
        {
            userId: ctx.session.user.id
        }
    })

    return saved
})
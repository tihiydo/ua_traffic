import { protectedProcedure } from "@/server/api/trpc";

export const haveOneChannel = protectedProcedure
    .query(async ({ ctx }) => {
        const bloggers = await ctx.db.blogger.findMany({
            where: {
                userId: ctx.session.user.id
            },
            select: {
                id: true
            }
        })

        const hasAccess = bloggers.length > 0
        return hasAccess
    })
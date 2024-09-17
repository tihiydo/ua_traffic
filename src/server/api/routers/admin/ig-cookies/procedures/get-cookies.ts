import { moderProcedure } from "@/server/api/trpc";



export const getCookiesProcedure = moderProcedure
    .query(async ({ ctx }) => {
        return ctx.db.iGCookie.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
    })
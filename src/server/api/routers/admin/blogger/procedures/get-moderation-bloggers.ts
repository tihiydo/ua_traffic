import { parseBlogger } from "@/database/blogger";
import { moderProcedure } from "@/server/api/trpc";


export const getModerationBloggersProcedure = moderProcedure
    .query(async ({ctx}) => {
        const bloggers = await ctx.db.blogger.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                User: {
                    select: {
                        email: true
                    }
                }
            }
        })

        return bloggers.map(parseBlogger);
    })
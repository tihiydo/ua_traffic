import { ERROR_CODES } from "@/constants/error-codes";
import { parseBlogger } from "@/database/blogger";
import { publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getBloggerSchema = z.object({
    bloggerId: z.string(),
})

export const getBloggerPublicViewProcedure = publicProcedure
    .input(getBloggerSchema)
    .query(async ({ ctx, input }) => {
        const blogger = await ctx.db.blogger.findUnique({
            where: {
                id: input.bloggerId
            },
            include: {
                SavedBloggers: {
                    where: {
                        userId: ctx.session?.user.id ?? '',
                    },
                    select: {
                        userId: true
                    },
                },
                reviews: {
                    where: {
                        status: 'Approved'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5,
                    include: {
                        advertiser: {
                            select: {
                                name: true,
                                image: true,
                                email: true,
                            }
                        }
                    }
            }
        }
        })

        if (!blogger) {
            throw new TRPCError({ code: 'NOT_FOUND', message: ERROR_CODES.BLOGGER_NOT_FOUND })
        }

        const otherChannels = await ctx.db.blogger.findMany({
            where: {
                id: {
                    not: input.bloggerId
                },
                userId: blogger.userId,
            },
            orderBy: {
                followersCount: 'desc'
            },
            include: {
                SavedBloggers: {
                    where: {
                        userId: ctx.session?.user.id ?? '',
                    },
                    select: {
                        userId: true
                    },
                },
            }
        })
        return {
            blogger: {
                ...parseBlogger(blogger),
                isSaved: !!blogger.SavedBloggers[0]
            },
            otherChannels: otherChannels.map(blogger => ({
                ...parseBlogger(blogger),
                isSaved: !!blogger.SavedBloggers[0]
            }))
        };
    })

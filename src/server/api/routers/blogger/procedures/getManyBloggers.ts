import { parseBlogger } from "@/database/blogger";
import { categories } from "@/database/blogger/categories";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { publicProcedure } from "@/server/api/trpc";
import { SocialType, type Prisma, BloggerStatus } from "@prisma/client";
import { z } from "zod";


const getManyBloggersInput = z.object(
    {
        sortOrder: z.enum(['asc', 'desc']),
        sortBy: z.enum(['subs']),
        sortByRating: z.enum(['rating']),
        category: createUnionSchema(categories),
        subs: z.array(z.number()).length(2),
        page: z.number(),
        take: z.number(),
        social: z.nativeEnum(SocialType),
        status: z.nativeEnum(BloggerStatus),
        search: z.union([z.string(), z.number()]),
    }
).partial()

export const getManyBloggersProcedure = publicProcedure
    .input(getManyBloggersInput)
    .query(async ({ input: filters, ctx }) => {


        let prismaFindOptions: Prisma.BloggerFindManyArgs = {
        }

        if (filters?.sortByRating) {
            prismaFindOptions = {
                ...prismaFindOptions,
                orderBy: {
                    rating: filters.sortOrder
                }
            }
        }

        if (filters?.search) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    username: {
                        contains: filters?.search.toString()
                    }
                }
            }
        }

        if (filters?.category) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    categories: {
                        array_contains: filters.category
                    } 
                }
            }
        }

        if (filters?.status) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    status: filters.status
                }
            }
        }

        if (filters?.social) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    type: filters.social
                }
            }
        }

        if (filters?.subs) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    followersCount: {
                        gte: filters.subs[0],
                        lte: filters.subs[1],
                    }
                }
            }
        }

        if (filters?.sortBy && filters.sortOrder) {
            if (filters.sortBy === 'subs') {
                prismaFindOptions = {
                    ...prismaFindOptions,
                    orderBy: {
                        ...prismaFindOptions.orderBy,
                        followersCount: filters.sortOrder
                    }
                }
            }
        }

        if (filters?.take) {
            prismaFindOptions = {
                ...prismaFindOptions,
                take: filters.take
            }
        }

        if (filters?.page && filters.take) {
            prismaFindOptions = {
                ...prismaFindOptions,
                skip: (filters.page - 1) * filters.take
            }
        }


        const bloggers = await ctx.db.blogger.findMany(prismaFindOptions)


        return bloggers.map(parseBlogger);
    })
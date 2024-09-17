import { AdPostType } from "@/database/ad-post/post/post-types";
import { parseBlogger } from "@/database/blogger";
import { categories } from "@/database/blogger/categories";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { type BloggerPrices } from "@/socials/shared/types";
import { type CatalogBlogger } from "@/types/enities/blogger";
import { excludeKeys } from "@/utils";
import { BloggerTag, type Prisma } from "@prisma/client";
import { z } from "zod";

export type FilterSettings = {
    minSubs: number;
    maxSubs: number;
    minPrice: number;
    maxPrice: number;
    maxDiscount: number;
    minDiscount: number;
}

export const filtersSchema = z
    .object({
        sortOrder: z.enum(['asc', 'desc']),
        sortBy: z.enum(['subs', 'price', 'discount', 'rating']),
        category: createUnionSchema(categories),
        postType: z.nativeEnum(AdPostType),
        tag: z.nativeEnum(BloggerTag),
        subs: z.array(z.number()).length(2),
        price: z.array(z.number()).length(2),
        page: z.number(),
        take: z.number(),
        search: z.union([z.string(), z.number()]),
    })
    .partial()

const getCatalogBloggersInput = z.object({
    tab: z.union([
        z.literal('Telegram'),
        z.literal('Instagram'),
        z.literal('Saved')
    ]),
    filters: filtersSchema.optional()
})

const calculateDiscount = (prices: BloggerPrices, postType: AdPostType) => {
    const price = prices[postType];
    if (!price || !price.discount) return 0;
    return price.discount.type === 'percentage' ? price.discount.value : 0;
};

export const getCatalogBloggersProcedure = publicProcedure
    .input(getCatalogBloggersInput)
    .query(async ({ input, ctx }) => {
        const { filters } = input;
        console.log("tag", filters?.tag)


        let prismaFindOptions: Prisma.BloggerFindManyArgs = {
            where: {
                status: "Active"
            },
            orderBy: {
                followersCount: 'desc'
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


        if (filters?.tag) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    tags: {
                        has: filters.tag
                    }
                }
            }
        }


        if (input.tab === 'Instagram') {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    type: 'Instagram'
                }
            }
        }

        if (input.tab === 'Telegram') {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    type: 'Telegram'
                }
            }
        }

        if (input.tab === 'Saved') {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    SavedBloggers: {
                        some: {
                            userId: ctx.session?.user.id ?? ''
                        }
                    }
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


        if (filters?.postType) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    prices: {
                        path: [filters.postType, 'amount'],
                        gte: 0,
                    }
                }
            }
        }

        if (filters?.price && filters?.postType) {
            prismaFindOptions = {
                ...prismaFindOptions,
                where: {
                    ...prismaFindOptions.where,
                    prices: {
                        path: [filters.postType, 'amount'],
                        gte: filters.price[0],
                        lte: filters.price[1],
                    }
                }
            }
        }


        if (filters?.sortBy && filters.sortOrder) {
            if (filters.sortBy === 'subs') {
                prismaFindOptions = {
                    ...prismaFindOptions,
                    orderBy: {
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

        if (filters?.sortBy === 'rating' && filters.sortOrder) {
            prismaFindOptions = {
                ...prismaFindOptions,
                orderBy: {
                    rating: filters.sortOrder
                }
            }
        }

        const bloggers = await ctx.db.blogger.findMany({
            ...prismaFindOptions,
            include: {
                SavedBloggers: {
                    where: {
                        userId: ctx.session?.user.id ?? '',
                    },
                    select: {
                        userId: true
                    },
                }
            }
        })

        if (filters?.sortBy === 'rating' && filters.sortOrder) {
            bloggers.sort((blogger1, blogger2) => {
                if (filters.sortOrder === 'asc') {
                    return blogger1.rating - blogger2.rating;
                }

                if (filters.sortOrder === 'desc') {
                    return blogger2.rating - blogger1.rating;
                }

                return 0;
            });
        }


        // custom order by price (prisma orderBy doesn't work on JSON field)
        if (filters?.sortBy === 'price' && filters.sortOrder && filters.postType) {
            bloggers.sort((blogger1, blogger2) => {
                const price1 = (blogger1.prices as BloggerPrices)?.[filters.postType ?? '']?.amount ?? 0;
                const price2 = (blogger2.prices as BloggerPrices)?.[filters.postType ?? '']?.amount ?? 0;

                if (filters.sortOrder === 'asc') {
                    return price1 - price2
                }

                if (filters.sortOrder === 'desc') {
                    return price2 - price1
                }

                return 0;
            })
        }

        if (filters?.sortBy === 'discount' && filters.sortOrder && filters.postType) {
            bloggers.sort((blogger1, blogger2) => {
                const discount1 = calculateDiscount(blogger1.prices as BloggerPrices, filters.postType!);
                const discount2 = calculateDiscount(blogger2.prices as BloggerPrices, filters.postType!);

                if (filters.sortOrder === 'asc') {
                    return discount1 - discount2;
                }

                if (filters.sortOrder === 'desc') {
                    return discount2 - discount1;
                }

                return 0;
            });
        }


        const itemsCount = (await ctx.db.blogger.findMany({
            where: prismaFindOptions.where,
            select: { username: true }
        })).length;


        const filterSettings = await getFilterSettings(prismaFindOptions, input.filters)

        return {
            bloggers: bloggers.map((blogger) => {
                return {
                    ...parseBlogger(blogger),
                    isSaved: !!blogger.SavedBloggers[0]
                } satisfies CatalogBlogger
            }),
            itemsCount,
            filterSettings
        } satisfies {
            bloggers: CatalogBlogger[];
            itemsCount: number;
            filterSettings: FilterSettings;
        }
    }
    );


export async function getFilterSettings(options: Prisma.BloggerFindManyArgs, filters: z.infer<typeof filtersSchema> | undefined) {
    const optionsForRangeFilters = {
        ...excludeKeys(['skip', 'take'], options),
        where: excludeKeys(['followersCount', 'prices', 'categories'], options.where ?? {}),
    } as Prisma.BloggerFindManyArgs

    const bloggersArray = await db.blogger.findMany({
        ...optionsForRangeFilters,
        select: {
            followersCount: true,
            prices: true
        }
    })

    const discountsArray = bloggersArray
        .map(({ prices }) => {
            const price = (prices as BloggerPrices)?.[filters?.postType ?? ''];
            return price?.discount?.type === 'percentage' ? price.discount.value : 0;
        })
        .filter(discount => discount != null) as number[];

    const maxDiscount = discountsArray.length
        ? Math.max(...discountsArray)
        : 0;

    const minDiscount = discountsArray.length
        ? Math.min(...discountsArray)
        : 0;

    const followersArray = bloggersArray.map(({ followersCount }) => followersCount)

    const minSubs = followersArray.length
        ? Math.min(...followersArray)
        : 0

    const maxSubs = followersArray.length
        ? Math.max(...followersArray)
        : 0



    const pricesArray = bloggersArray
        .map(({ prices }) => (prices as BloggerPrices)?.[filters?.postType ?? '']?.amount)
        .filter(price => price != null) as number[]

    const minPrice = pricesArray.length
        ? Math.min(...pricesArray)
        : 0;

    const maxPrice = pricesArray.length
        ? Math.max(...pricesArray)
        : 0;

    return {
        minSubs,
        maxSubs,
        minPrice,
        maxPrice,
        maxDiscount,
        minDiscount,
    } satisfies FilterSettings
}
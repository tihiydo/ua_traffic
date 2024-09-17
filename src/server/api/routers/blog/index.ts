import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Prisma } from '@prisma/client';
import { z } from "zod";

const sectionSchema = z.object({
    type: z.enum(["TITLE", "TEXT", "IMAGE"]),
    title: z.string().nullable().optional(),
    titleRu: z.string().nullable().optional(),
    titleEn: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    contentRu: z.string().nullable().optional(),
    contentEn: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
});

export const blogRouter = createTRPCRouter({
    createArticle: publicProcedure
        .input(z.object({
            title: z.string(),
            titleRu: z.string(),
            titleEn: z.string(),
            description: z.string(),
            descriptionRu: z.string(),
            descriptionEn: z.string(),
            isArchived: z.boolean().optional().default(false),
            image: z.string(),
            slug: z.string(),
            sections: z.array(sectionSchema),
        }))
        .mutation(async ({ input, ctx }) => {
            const article = await ctx.db.blogArticle.create({
                data: {
                    title: input.title,
                    titleRu: input.titleRu,
                    titleEn: input.titleEn,
                    description: input.description,
                    descriptionRu: input.descriptionRu,
                    descriptionEn: input.descriptionEn,
                    isArchived: input.isArchived,
                    image: input.image,
                    slug: input.slug,
                    Sections: {
                        create: input.sections.map(section => ({
                            type: section.type,
                            title: section.title,
                            titleRu: section.titleRu,
                            titleEn: section.titleEn,
                            content: section.content,
                            contentRu: section.contentRu,
                            contentEn: section.contentEn,
                            image: section.image,
                        })),
                    },
                },
            });
            await new Promise(resolve => setTimeout(resolve, 1000));

            return article;
        }),

    getArticleBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.blogArticle.findUnique({
                where: { slug: input.slug },
                include: {
                    Sections: true,
                    ratings: true,
                },
            });
        }),

    getAllArticles: publicProcedure
        .input(z.object({
            page: z.number().optional().default(1),
            perPage: z.number().optional().default(12),
            searchQuery: z.string().optional().default(''),
            locale: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const { page, perPage, searchQuery, locale } = input;
            const where: Prisma.BlogArticleWhereInput = {
                AND: [
                    searchQuery
                        ? {
                            OR: [
                                { title: { contains: searchQuery, mode: 'insensitive' } },
                                { titleRu: { contains: searchQuery, mode: 'insensitive' } },
                                { titleEn: { contains: searchQuery, mode: 'insensitive' } },
                                { description: { contains: searchQuery, mode: 'insensitive' } },
                                { descriptionRu: { contains: searchQuery, mode: 'insensitive' } },
                                { descriptionEn: { contains: searchQuery, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                    { isArchived: false },
                ],
            };

            const articles = await ctx.db.blogArticle.findMany({
                where,
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    ratings: true,
                },
            });

            const totalArticles = await ctx.db.blogArticle.count({ where });

            return {
                articles: articles.map(article => ({
                    ...article,
                    title: article[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof article] || article.title,
                    description: article[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof article] || article.description,
                })),
                totalPages: Math.ceil(totalArticles / perPage),
            };
        }),


    getArticleById: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const { id } = input;
            return await ctx.db.blogArticle.findUnique({
                where: { id },
                include: {
                    Sections: true,
                    ratings: true,
                },
            });
        }),

    getArticlesByIds: publicProcedure
        .input(z.object({
            ids: z.array(z.string()),
        }))
        .query(async ({ input, ctx }) => {
            const { ids } = input;
            return await ctx.db.blogArticle.findMany({
                where: { id: { in: ids } },
                include: {
                    Sections: true,
                    ratings: true,
                },
            });
        }),

    deleteArticle: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.articleRating.deleteMany({
                where: { articleId: input.id }
            });

            return await ctx.db.blogArticle.delete({
                where: { id: input.id }
            });
        }),

    updateArticle: publicProcedure
        .input(z.object({
            id: z.string(),
            title: z.string(),
            titleRu: z.string(),
            titleEn: z.string(),
            description: z.string(),
            descriptionRu: z.string(),
            descriptionEn: z.string(),
            image: z.string(),
            slug: z.string(),
            sections: z.array(sectionSchema),
        }))
        .mutation(async ({ input, ctx }) => {
            return ctx.db.blogArticle.update({
                where: { id: input.id },
                data: {
                    title: input.title,
                    titleRu: input.titleRu,
                    titleEn: input.titleEn,
                    description: input.description,
                    descriptionRu: input.descriptionRu,
                    descriptionEn: input.descriptionEn,
                    image: input.image,
                    slug: input.slug,
                    Sections: {
                        deleteMany: {},
                        create: input.sections.map(section => ({
                            type: section.type,
                            title: section.title,
                            titleRu: section.titleRu,
                            titleEn: section.titleEn,
                            content: section.content,
                            contentRu: section.contentRu,
                            contentEn: section.contentEn,
                            image: section.image,
                        })),
                    },
                },
            });
        }),

    rateArticle: publicProcedure
        .input(z.object({
            articleId: z.string(),
            rating: z.number().min(0.5).max(5),
        }))
        .mutation(async ({ input, ctx }) => {
            const { articleId, rating } = input;
            const article = await ctx.db.blogArticle.findUnique({ where: { id: articleId } });
            if (!article) {
                throw new Error('Article not found');
            }
            return await ctx.db.articleRating.create({
                data: { articleId, rating },
            });
        }),
    archiveArticle: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const article = await ctx.db.blogArticle.findUnique({ where: { id: input.id } });
            if (!article) {
                throw new Error('Article not found');
            }
            return await ctx.db.blogArticle.update({
                where: { id: input.id },
                data: { isArchived: !article.isArchived },
            });
        }),

    unarchiveArticle: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.blogArticle.update({
                where: { id: input.id },
                data: { isArchived: false },
            });
        }),

    getArchivedArticles: publicProcedure
        .input(z.object({
            page: z.number().optional().default(1),
            perPage: z.number().optional().default(12),
            locale: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const { page, perPage, locale } = input;
            const articles = await ctx.db.blogArticle.findMany({
                where: { isArchived: true },
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { createdAt: 'desc' },
                include: { ratings: true },
            });

            const totalArticles = await ctx.db.blogArticle.count({ where: { isArchived: true } });

            return {
                articles: articles.map(article => ({
                    ...article,
                    title: article[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof article] || article.title,
                    description: article[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof article] || article.description,
                })),
                totalPages: Math.ceil(totalArticles / perPage),
            };
        }),
});
import { z } from "zod";


export type StatisticCategory = z.infer<typeof StatisticCategorySchema>
export type StatisticCategoryItem = StatisticCategory[number]['daily'];
const StatisticCategorySchema = z.array(z.object({
    timestamp: z.string(),
    value: z.number(),
    daily: z.object({
        increase: z.number(),
        increasePercentage: z.number(),
    }),
    weekly: z.object({
        increase: z.number(),
        increasePercentage: z.number(),
    }),
    monthly: z.object({
        increase: z.number(),
        increasePercentage: z.number(),
    }),
}))


export type InstagramBloggerStatistic = z.infer<typeof InstagramBloggerStatisticSchema>
export const InstagramBloggerStatisticSchema = z.object({
    followers: StatisticCategorySchema,
}).partial();

export type TelegramBloggerStatistic = z.infer<typeof TelegramBloggerStatisticSchema>
export const TelegramBloggerStatisticSchema = z.object({
    followers: StatisticCategorySchema,
    coverage: StatisticCategorySchema,
}).partial()

import { InstagramAdPostType, TelegramAdPostType } from "@/database/ad-post/post/post-types"
import { z } from "zod"

export const BloggerPostDiscountType = {
    Percentage: 'percentage',
    Static: 'static',
} as const;

export const PostPriceSchema = z.object( {
    amount: z.number(),
    discount: z.object({
        value: z.number(),
        type: z.nativeEnum(BloggerPostDiscountType),
    }).optional()
}
)

export type IGBloggerPrices = z.infer<typeof IGBloggerPricesSchema>
export const IGBloggerPricesSchema: z.ZodType<Partial<Record<InstagramAdPostType, z.infer<typeof PostPriceSchema>>>> = z.object({
    [InstagramAdPostType.Story]: PostPriceSchema,
    [InstagramAdPostType.StoryTechTask]: PostPriceSchema,
})
    .partial()
    .refine((prices) => {
        return Object.values(prices).some(price => price.amount > 0)
    }, 'Хоча б одна цінова категорія повинна бути заповнена')

export type TGChannelPrices = z.infer<typeof TGChannelPricesSchema>
export const TGChannelPricesSchema: z.ZodType<Partial<Record<TelegramAdPostType, z.infer<typeof PostPriceSchema>>>> = z.object({
    [TelegramAdPostType.Post_30x24]: PostPriceSchema,
    [TelegramAdPostType.Post_1x24]: PostPriceSchema,
    [TelegramAdPostType.Post_2x48]: PostPriceSchema,
    [TelegramAdPostType.Post_3x72]: PostPriceSchema,
    [TelegramAdPostType.NoDeletion]: PostPriceSchema,
}).partial()
    .refine((prices) => {
        return Object.values(prices).some(price => price.amount > 0)
    }, 'Хоча б одна цінова категорія повинна бути заповнена')

export type BloggerPrices = z.infer<typeof BloggerPriceSchema>
export const BloggerPriceSchema = z.union([
    IGBloggerPricesSchema,
    TGChannelPricesSchema
])

export { parseBloggerPrices } from './utils'
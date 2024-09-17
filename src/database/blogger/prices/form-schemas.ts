import { InstagramAdPostType, TelegramAdPostType } from "@/database/ad-post/post/post-types"
import { formOptionalIntSchema } from "@/lib/zod/custom-schemas"
import { z } from "zod"

export const IGFormPricesSchema: z.ZodType<Partial<Record<InstagramAdPostType, string>>> = z.object({
    [InstagramAdPostType.Story]: formOptionalIntSchema,
    [InstagramAdPostType.StoryTechTask]: formOptionalIntSchema
})
    .partial()
    .refine((prices) => {
        return Object.values(prices).some(price => parseFloat(price) > 0)
    }, 'Хоча б одна цінова категорія повинна бути заповнена')


export const TGFormPricesSchema: z.ZodType<Partial<Record<TelegramAdPostType, string>>> = z.object({
    [TelegramAdPostType.Post_30x24]: formOptionalIntSchema,
    [TelegramAdPostType.Post_1x24]: formOptionalIntSchema,
    [TelegramAdPostType.Post_2x48]: formOptionalIntSchema,
    [TelegramAdPostType.Post_3x72]: formOptionalIntSchema,
    [TelegramAdPostType.NoDeletion]: formOptionalIntSchema
})
    .partial()
    .refine((prices) => {
        return Object.values(prices).some(price => parseFloat(price) > 0)
    }, 'Хоча б одна цінова категорія повинна бути заповнена')

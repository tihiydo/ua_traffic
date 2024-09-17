import { optionalIntRegEx } from "@/regex";
import { type AdPostType } from "@/database/ad-post/post/post-types";
import { type TranslateFn } from "@/types";
import { z } from "zod";

export const getSocialFormPricesSchema = <TPost extends AdPostType>(t: TranslateFn<'Validation'>, postTypes: readonly TPost[]) => {
    const priceCategorySchema = z.object({
        price: z.string().regex(optionalIntRegEx, t('invalid-number')),
        discountValue: z.string()
            .regex(optionalIntRegEx, t('invalid-number'))
            .refine(val => !val || (parseFloat(val) >= 1 && parseFloat(val) <= 99), t('percentage-range-1-99'))
            .optional(),
    });

    const prices = z.object(Object.fromEntries(
        postTypes.map(type => (
            [type, priceCategorySchema]
        ))
    )) satisfies z.ZodType<Record<string, { price: string; discountValue?: string }>>;

    return prices
        .refine((prices) => {
            return Object.values(prices).some(price => {
                return parseFloat(price.price ?? '0') > 0
            })
        }, t('price-categories-limit'));
}
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { AdPostType } from "@/database/ad-post/post/post-types";
import { BloggerTag, SocialType } from "@prisma/client";
import { z } from "zod";
import { categories } from "@/database/blogger/categories";

export type CatalogSearchParamsSchema = z.infer<typeof catalogSchema>;
export const catalogSchema = z.object({
    sortBy: z.enum(['subs', 'price', 'discount', 'rating']),
    sortOrder: z.enum(['asc', 'desc']),
    category: createUnionSchema(categories),
    postType: z.nativeEnum(AdPostType),
    tag: z.nativeEnum(BloggerTag),
    minSubs: z.number(),
    maxSubs: z.number(),
    minPrice: z.number(),
    maxPrice: z.number(),
    maxDiscount: z.number(),
    minDiscount: z.number(),
    search: z.string(),
    page: z.number(),
    social: z.nativeEnum(SocialType),
})
    .partial()
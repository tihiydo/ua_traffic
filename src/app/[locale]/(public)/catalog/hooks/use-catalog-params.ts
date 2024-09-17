import { useSearchParamsState } from "@/hooks/use-search-params-state";
import { type FilterSettings } from "@/server/api/routers/blogger/procedures/get-catalog-bloggers";
import { useZodSchema } from "@/hooks/use-zod-schema";
import { z } from "zod";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { type CatalogTabType } from "../components/social-type-select";
import { AdPostType } from "@/database/ad-post/post/post-types";
import { type Category, categories } from "@/database/blogger/categories";
import { BloggerTag } from "@prisma/client";

type CatalogSearchParams = Partial<{
    sortBy: 'subs' | 'price' | 'discount' | 'rating';
    sortOrder: 'asc' | 'desc';
    category: Category,
    postType: AdPostType;
    tag: BloggerTag;
    minSubs: number;
    maxSubs: number;
    minPrice: number;
    maxPrice: number;
    maxDiscount: number;
    minDiscount: number;
    search: string,
    page: number,
    tab: CatalogTabType,
}>

export const getCatalogSchema = () => {
    return z.object({
        sortBy: z.enum(['subs', 'price', 'discount', 'rating']),
        sortOrder: z.enum(['asc', 'desc']),
        category: createUnionSchema(categories),
        postType: z.nativeEnum(AdPostType),
        tag: z.nativeEnum(BloggerTag),
        minSubs: z.number(),
        maxSubs: z.number(),
        minPrice: z.number(),
        maxPrice: z.number(),
        minDiscount: z.number(),
        maxDiscount: z.number(),
        search: z.string(),
        page: z.number(),
        tab: z.union([
            z.literal('Saved'),
            z.literal('Instagram'),
            z.literal('Telegram'),
        ]),
    })
        .partial()
}

export function useCatalogParams(settings?: FilterSettings) {
    const schema = useZodSchema<CatalogSearchParams>(() => {
        return getCatalogSchema()
    }, [settings])

    return useSearchParamsState(schema, {
        defaultValues: {
            minSubs: settings?.minSubs,
            maxSubs: settings?.maxSubs,
            minPrice: settings?.minPrice,
            maxPrice: settings?.maxPrice,
            minDiscount: settings?.minDiscount,
            maxDiscount: settings?.maxDiscount,
            page: 1,
            search: '',
            tab: 'Instagram',
        }
    });
}

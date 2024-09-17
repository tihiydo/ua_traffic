import { excludingValidator } from "@/lib/zod/validator";
import { parseStringType } from "@/utils";
import { type filtersSchema } from "@/server/api/routers/blogger/procedures/get-catalog-bloggers";
import { type z } from "zod";
import { getCatalogSchema } from "./hooks/use-catalog-params";
import { type CatalogTabType } from "./components/social-type-select";

// Parse query values to booleans, numbers, etc.
function parseSearchParamsObject(searchParams: Record<string, string | string[] | undefined>) {
    const typeTransformedFilters = Object.entries(searchParams)
        .map(([key, value]) => {
            if (typeof value !== 'string') return {};

            return {
                [key]: parseStringType(value)
            }
        })
        .reduce((acc, value) => {
            return {
                ...acc,
                ...value
            }
        }, {})

    return typeTransformedFilters
}

export function parseCatalogParamsToFilters(searchParams: Record<string, string | string[] | undefined>): { tab: CatalogTabType, filters: z.infer<typeof filtersSchema> } {
    const values = parseSearchParamsObject(searchParams);
    const parseResult = excludingValidator(getCatalogSchema())(values);

    return {
        tab: parseResult.tab ?? 'Instagram',
        filters: {
            category: parseResult.category,
            page: parseResult.page,
            sortBy: parseResult.sortBy,
            sortOrder: parseResult.sortOrder,
            tag: parseResult.tag,
            subs: [parseResult.minSubs ?? 0, parseResult.maxSubs ?? 1000000000],
            price: [parseResult.minPrice ?? 0, parseResult.maxPrice ?? 1000000000],
            postType: parseResult.postType,
            search: parseResult.search,
        }
    };
}
import { useEffect, useState } from "react";
import { useMutableSearchParams } from "@/hooks/use-mutable-search-params";
import { type z } from "zod";
import { useSearchParams } from 'next/navigation';

export const useTabs = <T extends string>(schema: z.ZodUnion<[z.ZodLiteral<T>, ...z.ZodLiteral<T>[]]>, input: {
    key: string,
    defaultValue: T,
}) => {
    const searchParams = useSearchParams();
    const mutableSearchParams = useMutableSearchParams();
    const searchParamsTab = searchParams.get(input.key);
    const parsedTab = schema.safeParse(searchParamsTab);



    const [page, setPage] = useState<T>(
        parsedTab.success
            ? parsedTab.data
            : input.defaultValue
    );

    useEffect(() => {
        const parsedTab = schema.safeParse(searchParamsTab);
        if (parsedTab.success) {
            if (page === parsedTab.data) return;
            setPage(parsedTab.data)
        }
    }, [searchParamsTab])

    return [
        page,
        (tab: T) => {
            mutableSearchParams.set(input.key, tab);
            setPage(tab)
        }
    ] as const
}
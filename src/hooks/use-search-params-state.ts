'use client'

import { usePathname, useRouter } from "@/i18n/navigation";
import { isValid } from "@/lib/zod/isValid";
import { excludingValidator } from "@/lib/zod/validator";
import { excludeKeys, parseStringType, pickKeys } from "@/utils";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react"
import { type z } from "zod";
import { zodKeys } from "@/lib/zod/zod-keys";
import deepEqual from 'fast-deep-equal'

function searchParamsToObject(params: ReadonlyURLSearchParams) {
    const entries = params.entries()
    const paramsObj: SearchParamsMap = {};

    for (const [key, value] of entries) {
        const parsedValue = parseStringType(value);

        paramsObj[key] = parsedValue
    }

    return paramsObj;
}

function objectToSearchParams(params: SearchParamsMap) {
    const map = Object.entries(params).reduce((acc, [key, value]) => {
        if (value == null) {
            return acc
        } else {
            return {
                [key]: value?.toString(),
                ...acc
            }
        }
    }, {});

    return new URLSearchParams(map)
}

type Options<T extends SearchParamsMap> = {
    defaultValues?: T
}


type SupportedParamsValues = string | number | boolean | null | undefined
type SearchParamsMap = Record<string, SupportedParamsValues>

export function useSearchParamsState<T extends z.ZodType<SearchParamsMap>>(schema: T, options: Options<z.infer<T>>) {
    type V = z.infer<T>;

    const schemaKeys = zodKeys(schema);
    const searchParams = useSearchParams();
    const searchParamsObject = useMemo(() => (
        searchParamsToObject(searchParams)
    ), [searchParams])

    const pickSchemaSearchParams = (value: V) => (
        pickKeys(zodKeys(schema), value) as Partial<V>
    )

    const router = useRouter();
    const pathname = usePathname()
    const [schemaParams, setSchemaParams] = useState<Partial<V>>({
        ...options.defaultValues,
        ...pickSchemaSearchParams(searchParamsObject)
    });

    useEffect(() => {
        // remove invalid schema fields
        const validatedParams = excludingValidator(schema)(searchParamsObject);

        setSchemaParams(
            pickSchemaSearchParams({ ...options.defaultValues, ...validatedParams, })
        );
    }, [searchParamsObject]);

    const mutateParams = useCallback((fn: (params: SearchParamsMap) => V) => {
        let newValue = fn(schemaParams);
        console.log('mutate', newValue)

        const keysToExclude: string[] = [];
        // Get keys where value is equal to default value or undefined
        Object.entries(newValue)
            .map(([key, newValue]) => {
                const defaultValue = options.defaultValues?.[key];

                if (newValue === defaultValue || newValue == null || newValue == '') {
                    keysToExclude.push(key);
                }
            })

        newValue = excludeKeys(keysToExclude, newValue);

        if (deepEqual(newValue, pickKeys(schemaKeys, searchParamsObject))) return;


        if (isValid(schema, newValue)) {
            const paramsString = objectToSearchParams({
                ...newValue,
                ...excludeKeys(schemaKeys, searchParamsObject)
            });
            router.replace(`${pathname}${paramsString ? `?${paramsString}` : ''}`)
        }
    }, [searchParamsObject, router, pathname, schema, options.defaultValues])

    const remove = useCallback((key: keyof V) => {
        mutateParams((params) => excludeKeys([key.toString()], params));
    }, [mutateParams])

    const exclude = useCallback((keys: (keyof V)[]) => {
        mutateParams((params) => excludeKeys(keys, params as V));
    }, [mutateParams])

    const include = useCallback((keys: (keyof V)[]) => {
        mutateParams((params) => pickKeys(keys, params as V));
    }, [mutateParams])

    const update = useCallback(<K extends keyof V>(key: K, value: V[K]) => {
        mutateParams((params) => ({
            ...params,
            [key]: value
        }));
    }, [mutateParams])

    const merge = useCallback((mergedParams: Partial<V>) => {

        mutateParams(params => {
            return {
                ...params,
                ...mergedParams
            }
        });
    }, [mutateParams])

    const replace = useCallback((mergedParams: Partial<V>) => {
        mutateParams(() => mergedParams);
    }, [mutateParams])

    const clear = useCallback(() => {
        mutateParams(params => excludeKeys(zodKeys(schema), params));
    }, [mutateParams, schema])

    return {
        schemaParams,
        remove, update, merge, clear, exclude, include, replace
    };
}




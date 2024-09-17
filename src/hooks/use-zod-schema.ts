import { useMemo } from "react"
import { type ZodType } from "zod";

export const useZodSchema = <const T extends Record<string, any>>(fn: () => ZodType<T>, deps: any[]): ZodType<T> => {
    const memoSchema = useMemo(fn, deps);

    return memoSchema;
}
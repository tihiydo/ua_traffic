'use client'

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function useMutableSearchParams() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    const deleteParam = (key: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.delete(key)

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    }

    const appendParam = (key: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.append(key, value)

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    }

    const setParam = (key: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.set(key, value)

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    }
    

    return {
        ...searchParams,
        delete: deleteParam,
        append: appendParam,
        set: setParam
    }
}
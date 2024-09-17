import { type useTranslations } from "next-intl";

// T here just for DX
export type TranslateFn<T extends string = string> = ReturnType<typeof useTranslations<T>>
export const locales = ["ua", "ru", "en"] as const;
export const defaultLocale: Locale = "ua";

export const localePrefix = "as-needed";

export type Locale = (typeof locales)[number];

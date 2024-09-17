import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from '@/i18n/config'

export default createMiddleware({
    defaultLocale: "ua",
    locales,
    localeDetection: false,
    localePrefix,
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)',],
};

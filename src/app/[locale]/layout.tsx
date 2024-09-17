import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";
import { locales } from "@/i18n/config";
import { kankin, montserrat, unbounded } from "@/fonts";
import SessionProvider from "../[locale]/_utils/session-provider";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CookieMessage from "./(client)/_components/cookie-message";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import getRequestConfig from "@/i18n/getRequestConfig";
import { Suspense } from "react";
import "@/styles/globals.css";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import Script from "next/script";
import { type Metadata } from "next";
import siteImage from '@/assets/images/site-image.png'
import { getServerAuthSession } from "@/server/auth";
import AskAction from "@/components/ui/custom/ask-action";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        openGraph: {
            images: [siteImage.src],
        },
    }
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const { messages } = await getRequestConfig({ locale })
    unstable_setRequestLocale(locale);

    const session = await getServerAuthSession();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-GFZDVM2ML5"
                />
                <Script id="google-analytics">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                      
                        gtag('config', 'G-GFZDVM2ML5');
                    `}
                </Script>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </head>
            <body
                className={`h-full font-content text-main ${montserrat.variable} ${unbounded.variable} ${kankin.variable} select-none`}
            >
                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                >
                    <Suspense
                        fallback={<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <SpinnerLoading size={50} />
                        </div>}
                    >
                        <SessionProvider session={session}>
                            <TRPCReactProvider
                                cookies={cookies().toString()}
                            >
                                <CookieMessage />
                                {children}
                                <ToastContainer position="bottom-right" />
                            </TRPCReactProvider>
                        </SessionProvider>
                    </Suspense>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

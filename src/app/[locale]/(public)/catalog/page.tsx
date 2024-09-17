
import { InstagramTab } from "./(instagram)";
import { TelegramTab } from "./(telegram)";
import { api } from "@/trpc/server";
import { TAKE_ITEMS } from "./constants";
import { parseCatalogParamsToFilters } from "./utils";
import { locales } from "@/i18n/config";
import SocialTypeSelect, { CatalogTabContent } from "./components/social-type-select";
import SavedTab from "./(saved)/saved-tab";
import { type Metadata } from "next";
import {  getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { env } from "@/env.mjs";
import PageTitle from '@/components/page-title';
import Translate from '@/components/Translate';

// Revalidate every 10 minutes
export const revalidate = 60 * 10;

export async function generateStaticParams() {
    return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale });

    return {
        title: 'UATRAFFIC | ' + t('Catalogue.meta/title'),
        description: t('Catalogue.meta/description'),
        openGraph: {
            type: 'website',
            title: 'UATRAFFIC | ' + t('Catalogue.meta/title'),
            description: t('Catalogue.meta/description'),
            url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/catalog`,
            siteName: 'UATRAFFIC'
        }
    }
}

type Props = {
    searchParams: Record<string, string | string[] | undefined>
    params: { locale: string }
}


const CatalogPage = async ({ searchParams, params }: Props) => {
    unstable_setRequestLocale(params.locale);

    const { filters, tab } = parseCatalogParamsToFilters(searchParams);
    const { bloggers, filterSettings, itemsCount } = await api.blogger.getCatalogBloggers.query({
        tab: tab,
        filters: {
            ...filters,
            take: TAKE_ITEMS,
        },
    });

    return (<>
    <div className='my-[50px]'><PageTitle><Translate namespace="Catalogue" itemKey="title" /></PageTitle></div>
        <SocialTypeSelect>
            <CatalogTabContent value="Instagram">
                <InstagramTab
                    filterSettings={filterSettings}
                    pageBloggers={bloggers ?? []}
                    totalBloggersCount={itemsCount}
                />
            </CatalogTabContent>

            <CatalogTabContent value="Telegram">
                <TelegramTab
                    filterSettings={filterSettings}
                    pageBloggers={bloggers ?? []}
                    totalBloggersCount={itemsCount}
                />
            </CatalogTabContent>

            <CatalogTabContent value="Saved">
                <SavedTab
                    filterSettings={filterSettings}
                    pageBloggers={bloggers ?? []}
                    totalBloggersCount={itemsCount}
                />
            </CatalogTabContent>
        </SocialTypeSelect>
        </>

    );
};

export default CatalogPage;

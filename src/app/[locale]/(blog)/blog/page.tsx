import { api } from '@/trpc/server';
import ArticleCard from './_components/ArticleCard';
import Pagination from './_components/Pagination';
import SearchBar from './_components/SearchBar';
import SidebarArticle from './_components/SiderbarArticle';
import { getTranslations } from 'next-intl/server';
import { defaultLocale, type Locale } from "@/i18n/config";

type Props = {
  searchParams: {
    page?: string;
    q?: string;
  };
  params: {
      locale: Locale
  }
};

export const metadata = {
    title: 'Блог',
    description: 'Останні статті з нашого блогу',
};

export default async function BlogPage({ searchParams, params }: Props) {
    const page = searchParams?.page || '1';
    const searchQuery = searchParams?.q || '';
    const currentPage = parseInt(page, 10) || 1;
    const articlesPerPage = 12;
    const t = await getTranslations("Blog");

    const locale = params?.locale || defaultLocale

    const { articles, totalPages } = await api.blog.getAllArticles.query({
        page: currentPage,
        perPage: articlesPerPage,
        searchQuery,
        locale
    });

    const formattedArticles = articles.map(article => ({
        ...article,
        createdAt: article.createdAt.toISOString(),
        ratings: article.ratings || []
    }));

    const showFeaturedContent = currentPage === 1 && !searchQuery;

    let formattedLargeArticle = null;
    let formattedSidebarArticles: Array<object> = [];

    if (showFeaturedContent) {
        const customLargeArticle = await api.blog.getArticleById.query({ id: 
            //тут має бути id головної статті у '' 
            'clxymmbs90000y3000u0clmcd'
        });
        formattedLargeArticle = customLargeArticle ? {
            ...customLargeArticle,
            // @ts-expect-error
            title: customLargeArticle[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}`] || customLargeArticle.title,
            // @ts-expect-error
            description: customLargeArticle[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}`] || customLargeArticle.description,
            createdAt: customLargeArticle.createdAt.toISOString(),
            ratings: customLargeArticle.ratings || []
        } : null;

        const sidebarArticles = await api.blog.getArticlesByIds.query({
            ids: [
                //тут мають бути id статей у сайдбарі у ''
                'clxyn4cjo0005y300jjtd3f6i',
                'clxynu1yz0007y300oxh0s0sh',
                'clxyldj9z0000jkeh71t99ccq'
            ],
        });

        formattedSidebarArticles = sidebarArticles.map(article => ({
            ...article,
            // @ts-expect-error
            title: article[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}`] || article.title,
            // @ts-expect-error
            description: article[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}`] || article.description,
            createdAt: article.createdAt.toISOString(),
            ratings: article.ratings || []
        }));
    }

    return (
        <div className="max-w-9xl mt-8">
            <h1 className="text-4xl font-bold mb-4">{t("navname")}</h1>
            <div className="mb-6">
                <SearchBar />
            </div>
            {showFeaturedContent && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {formattedLargeArticle && (
                        <div className="lg:col-span-2">
                            <ArticleCard article={formattedLargeArticle} isLatest />
                        </div>
                    )}
                    <div className="lg:col-span-1 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 pt-4 lg:pt-0 lg:pl-6">
                        {formattedSidebarArticles.map((article) => (
                            // @ts-expect-error
                            <SidebarArticle key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedArticles.map((article) => (
                    // @ts-expect-error
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
            <div className="mt-10">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
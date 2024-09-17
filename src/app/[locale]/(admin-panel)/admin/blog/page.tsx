import { api } from '@/trpc/server';
import AdminArticleCard from './_components/AdminArticleCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { defaultLocale, type Locale } from "@/i18n/config";

export const metadata = {
    title: 'Управління блогом',
    description: 'Адміністрування статей блогу',
};

export default async function AdminBlogPage({ params }: { params: { locale: Locale }}) {

    const locale = params?.locale || defaultLocale

    const { articles } = await api.blog.getAllArticles.query({
        page: 1,
        perPage: 100,
        locale,
    });

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <h1 className="text-4xl font-bold mb-8">Управління блогом</h1>
            <div className="flex justify-end gap-4 mb-4">
                <Link href="/admin/blog/new-article">
                    <Button>Створити статтю</Button>
                </Link>
                <Link href="/admin/blog/archive">
                    <Button>Архів</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    // @ts-expect-error
                    <AdminArticleCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
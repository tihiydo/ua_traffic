import { api } from '@/trpc/server';
import AdminArticleCard from '../_components/AdminArticleCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { defaultLocale, type Locale } from "@/i18n/config";

export const metadata = {
    title: 'Архів блогу',
    description: 'Архівовані статті блогу',
};

export default async function AdminBlogArchivePage({ params }: { params: { locale: Locale }}) {
    const locale = params?.locale || defaultLocale

    const { articles } = await api.blog.getArchivedArticles.query({
  page: 1,
  perPage: 100,
  locale,
});

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <h1 className="text-4xl font-bold mb-8">Архів блогу</h1>
            <div className="flex justify-end mb-4">
                <Link href="/admin/blog">
                    <Button>Повернутися до блогу</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    // @ts-expect-error
                    <AdminArticleCard key={article.id} article={article} isArchived={true} />
                ))}
            </div>
        </div>
    );
}
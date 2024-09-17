import { defaultLocale, type Locale } from "@/i18n/config";
import { api } from "@/trpc/server";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from "next/navigation";
import RatingComponent from '../_components/RatingComponent';

type Params = {
  slug: string;
  locale: Locale
};

export async function generateMetadata({ params }: { params: Params }) {
    const article = await api.blog.getArticleBySlug.query({ slug: params.slug });
    if (!article) return { title: "Article Not Found" };
    return { title: article.title, description: article.description };
}

export const revalidate = 3600;

export default async function ArticlePage({ params }: { params: Params }) {
    const article = await api.blog.getArticleBySlug.query({ slug: params.slug });
    if (!article) notFound();

    const locale = params?.locale || defaultLocale

    const ratings = article.ratings || [];
    const averageRating = ratings.length > 0
        ? ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length
        : 0;

    const localizedArticle = {
        ...article,
        title: article[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof article] || article.title,
        description: article[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof article] || article.description,
        Sections: article.Sections.map(section => ({
            ...section,
            title: section[`title${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof section] || section.title,
            content: section[`content${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof section] || section.content,
        })),
    };

    const formattedDate = new Date(localizedArticle.createdAt).toLocaleDateString();

    const createAnchor = (title: string) =>
        title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="flex items-center mb-4">
                <Link href={`/${locale}/blog`}>
                    <ChevronLeft className="w-8 h-8 mb-2 text-slate-500 hover:text-black cursor-pointer mr-2" />
                </Link>
                <h1 className="text-4xl font-bold mb-4">{localizedArticle.title as string}</h1>
            </div>
            <div className="flex flex-col lg:flex-row">
                <article className="lg:w-3/4 px-4 lg:border-r lg:border-slate-300 lg:pr-8">
                    {/* eslint-disable-next-line */}
                    <img src={localizedArticle.image || '/default-image.jpg'} alt={localizedArticle.title as string} width={800} height={400} className="mb-6 w-full" />
                    <div className="
        [&_ul]:!list-disc [&_ol]:!list-decimal [&_ul]:!list-inside [&_ol]:!list-inside [&_ul]:!ml-10 [&_ul]:!mt-5 [&_ol]:!ml-10 [&_ol]:!mt-5
        [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!my-4
        [&_h2]:!text-2xl [&_h2]:!font-semibold [&_h2]:!my-3
        [&_h3]:!text-xl [&_h3]:!font-medium [&_h3]:!my-2
        [&_h4]:!text-lg [&_h4]:!font-medium [&_h4]:!my-2
        [&_h5]:!text-base [&_h5]:!font-medium [&_h5]:!my-2
        [&_h6]:!text-sm [&_h6]:!font-medium [&_h6]:!my-2
        [&_p]:!my-2
    " dangerouslySetInnerHTML={{ __html: localizedArticle.description as string }} />


                    <div className="lg:hidden flex flex-col items-center mb-4">
                        <div className="border-t border-slate-300 w-full mt-4"></div>
                        <ul className="list-disc list-inside space-y-2">
                            {localizedArticle.Sections.filter(section => section.type === "TITLE" && section.title).map((section, index) => (
                                <li key={index}>
                                    <a href={`#${createAnchor(section.title!)}`} className="text-blue-500 hover:underline">
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {localizedArticle.Sections.map((section, index) => (
                        <div key={index} className="mb-6">
                            {section.type === "TITLE" && section.title && (
                                <h2 id={createAnchor(section.title)} className="text-2xl font-semibold mb-2">
                                    {section.title}
                                </h2>
                            )}
                            {section.type === "TEXT" && section.content && (
                            <div className="
        [&_ul]:!list-disc [&_ol]:!list-decimal [&_ul]:!list-inside [&_ol]:!list-inside [&_ul]:!ml-10 [&_ul]:!mt-5 [&_ol]:!ml-10 [&_ol]:!mt-5
        [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!my-4
        [&_h2]:!text-2xl [&_h2]:!font-semibold [&_h2]:!my-3
        [&_h3]:!text-xl [&_h3]:!font-medium [&_h3]:!my-2
        [&_h4]:!text-lg [&_h4]:!font-medium [&_h4]:!my-2
        [&_h5]:!text-base [&_h5]:!font-medium [&_h5]:!my-2
        [&_h6]:!text-sm [&_h6]:!font-medium [&_h6]:!my-2
        [&_p]:!my-2
    " dangerouslySetInnerHTML={{ __html: section.content }} />
                            )}
                            {section.type === "IMAGE" && section.image && (
                                <div className="w-full mb-4">
                                    <div className="relative w-full">
                                        {/* eslint-disable-next-line */}
                                        <img
                                            className='w-full'
                                            src={`${section.image}?${Date.now()}`}
                                            alt={section.title || "Section image"}
                                            width={800}
                                            height={450}
                                        />
                                    </div>
                                    {section.title && <p className="text-sm text-gray-500 mt-2 text-center">{section.title}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </article>

                <aside className="hidden lg:block lg:w-1/4 px-4">
                    <div className="sticky top-20">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500">{formattedDate}</span>
                            <div className='flex flex-row items-center gap-2'>
                                <RatingComponent articleId={localizedArticle.id} initialRating={averageRating} />
                                <p>({ratings.length})</p>
                            </div>
                        </div>
                        <div className="border-t border-slate-300 w-full mt-4 mb-4 lg:border-slate-300"></div>
                        <ul className="list-disc list-inside space-y-2">
                            {localizedArticle.Sections.filter(section => section.type === "TITLE" && section.title).map((section, index) => (
                                <li key={index}>
                                    <a href={`#${createAnchor(section.title!)}`} className="text-blue-500 hover:underline">
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
            <div className="flex justify-between items-center mb-4 lg:hidden">
                <span className="text-gray-500">{formattedDate}</span>
                <div className='flex flex-row items-center gap-2'>
                    <RatingComponent articleId={localizedArticle.id} initialRating={0} />
                    <p>({ratings.length})</p>
                </div>
            </div>
        </div>
    );
}

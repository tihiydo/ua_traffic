"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ArticleForm from '../../_components/article-form';
import { api } from '@/trpc/react';
import { Button } from "@/components/ui/button";
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import type { BlogFormData } from '../../_components/article-form';

const AdminArchivedArticlePage = ({ params }: { params: { slug: string } }) => {
    const router = useRouter();
    const { data: fetchedArticle, isLoading } = api.blog.getArticleBySlug.useQuery({ slug: params.slug });

    const transformArticleData = (article: typeof fetchedArticle): (BlogFormData & { id?: string }) | undefined => {
        if (!article) return undefined;
        return {
            id: article.id,
            title: article.title,
            titleRu: article.titleRu || '',
            titleEn: article.titleEn || '',
            description: article.description,
            descriptionRu: article.descriptionRu || '',
            descriptionEn: article.descriptionEn || '',
            image: article.image,
            isArchived: article.isArchived,
            slug: article.slug,
            sections: article.Sections.map(section => {
                switch (section.type) {
                    case 'TITLE':
                        return {
                            type: 'TITLE',
                            title: section.title || '',
                            titleRu: section.titleRu || '',
                            titleEn: section.titleEn || ''
                        };
                    case 'TEXT':
                        return {
                            type: 'TEXT',
                            content: section.content || '',
                            contentRu: section.contentRu || '',
                            contentEn: section.contentEn || ''
                        };
                    case 'IMAGE':
                        return {
                            type: 'IMAGE',
                            image: section.image || '',
                            title: section.title || '',
                            titleRu: section.titleRu || '',
                            titleEn: section.titleEn || ''
                        };
                    default:
                        throw new Error(`Unknown section type: ${section.type}`);
                }
            }),
        };
    };

    const { mutate: updateArticle } = api.blog.updateArticle.useMutation({
        onSuccess: () => {
            toast.success('Архівовану статтю оновлено успішно');
        },
        onError: (error) => {
            toast.error(`Помилка оновлення архівованої статті: ${error.message}`);
        },
    });

    const { mutate: unarchiveArticle } = api.blog.unarchiveArticle.useMutation({
        onSuccess: () => {
            toast.success('Статтю розархівовано та додано до основного блогу');
            router.push('/admin/blog');
        },
        onError: (error) => {
            toast.error(`Помилка розархівування статті: ${error.message}`);
        },
    });

    const handleUpdate = async (data: BlogFormData & { id?: string }) => {
        console.log("Updating archived article with data:", data);
        try {
            if (!fetchedArticle?.id) {
                throw new Error("Article ID is missing");
            }
            await updateArticle({
                id: fetchedArticle.id,
                ...data,
                image: data.image || '',
                title: data.title || '',
                titleRu: data.titleRu || '',
                titleEn: data.titleEn || '',
                description: data.description || '',
                descriptionRu: data.descriptionRu || '',
                descriptionEn: data.descriptionEn || '',
            });
        } catch (error) {
            console.error('Error updating archived article:', error);
            toast.error(`Error updating archived article: ${(error as Error).message}`);
        }
    };

    const validateArticle = (article: typeof fetchedArticle) => {
        if (!article) return false;
        return !!(article.title && article.description && article.image && article.titleEn && article.titleRu && article.descriptionEn && article.descriptionRu);
    };

    const handleUnarchive = () => {
        if (!validateArticle(fetchedArticle)) {
            toast.error('Неможливо розархівувати статтю. Перевірте, чи всі обов\'язкові поля заповнені.');
            return;
        }

        if(fetchedArticle) {
            console.log("Unarchiving article with ID:", fetchedArticle.id);
            unarchiveArticle({ id: fetchedArticle.id });
        }
    };

    if (isLoading) {
        return <SpinnerLoading color="#000000"/>;
    }

    if (!fetchedArticle) {
        return <div>Архівовану статтю не знайдено</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <ArticleForm 
                initialData={transformArticleData(fetchedArticle)} 
                isArchived={true} 
                onUpdate={handleUpdate} 
                isEditing={true} 
                isArchivedState={false} 
            />
            <div className="mt-8 flex justify-center">
                <Button 
                    onClick={handleUnarchive}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Розархівувати та додати до блогу
                </Button>
            </div>
        </div>
    );
};

export default AdminArchivedArticlePage;
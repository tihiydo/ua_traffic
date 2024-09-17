"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ArticleForm from '../_components/article-form';
import { api } from '@/trpc/react';
import { Button } from "@/components/ui/button";
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import type { BlogFormData } from '../_components/article-form';


const AdminArticlePage = ({ params }: { params: { slug: string } }) => {
    const router = useRouter();
    const { data: fetchedArticle, isLoading } = api.blog.getArticleBySlug.useQuery({ slug: params.slug });

    const transformArticleData = (article: typeof fetchedArticle): (BlogFormData & { id?: string }) | undefined => {
        if (!article) return undefined;
        return {
            id: article.id,
            title: article.title,
            isArchived: article.isArchived,
            titleRu: article.titleRu || '',
            titleEn: article.titleEn || '',
            description: article.description,
            descriptionRu: article.descriptionRu || '',
            descriptionEn: article.descriptionEn || '',
            image: article.image,
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
            toast.success('Стаття оновлена успішно');
        },
        onError: (error) => {
            toast.error(`Error updating article: ${error.message}`);
        },
    });

    const { mutate: deleteArticle } = api.blog.deleteArticle.useMutation({
        onSuccess: () => {
            toast.success('Стаття видалена успішно');
            router.push('/admin/blog');
        },
        onError: (error) => {
            toast.error(`Помилка при видаленні статті: ${error.message}`);
        },
    });

    const handleUpdate = async (formData: BlogFormData & { id?: string }) => {
        console.log("Updating article with data:", formData);
        try {
            if (!fetchedArticle?.id) {
                throw new Error("Article ID is missing");
            }
            await updateArticle({
                id: fetchedArticle.id,
                ...formData,
                titleRu: formData.titleRu || '',
                titleEn: formData.titleEn || '',
                descriptionRu: formData.descriptionRu || '',
                descriptionEn: formData.descriptionEn || '',
            });
        } catch (error) {
            console.error('Error updating article:', error);
            toast.error(`Error updating article: ${(error as Error).message}`);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Ви впевнені, що хочете видалити цю статтю?')) {
            if(fetchedArticle) {
                console.log("Deleting article with ID:", fetchedArticle.id);
                deleteArticle({ id: fetchedArticle.id });
            }
        }
    };

    if (isLoading) {
        <SpinnerLoading color="#000000"/> ;
    }

    if (!fetchedArticle) {
        return <div>Article not found</div>;
    }

    return (
        <div>
            <ArticleForm initialData={transformArticleData(fetchedArticle)} onUpdate={handleUpdate} isEditing={true} />
            <div className="mt-4 flex justify-center space-x-4">
                <Button variant="destructive" onClick={handleDelete}>Видалити статтю</Button>
            </div>
        </div>
    );
};

export default AdminArticlePage;

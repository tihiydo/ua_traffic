'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogArticle } from "@prisma/client";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { api } from '@/trpc/react';
import { toast } from 'react-toastify';

type ExtendedBlogArticle = BlogArticle & {
  ratings: { id: number; articleId: string; rating: number; }[];
};

type Props = {
  article: ExtendedBlogArticle;
  isArchived?: boolean;
};

const AdminArticleCard = ({ article, isArchived = false }: Props) => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { mutate: toggleArchiveStatus } = api.blog.archiveArticle.useMutation({
        onSuccess: () => {
            toast.success(isArchived ? 'Статтю розархівовано' : 'Статтю архівовано');
            router.refresh(); 
        },
        onError: (error) => {
            toast.error(`Помилка зміни статусу архівування: ${error.message}`);
        },
    });

    const handleViewArticle = () => {
        router.push(`/blog/${article.slug}`);
        setIsDropdownOpen(false);
    };

    const handleEditArticle = () => {
        router.push(isArchived ? `/admin/blog/archive/${article.slug}` : `/admin/blog/${article.slug}`);
        setIsDropdownOpen(false);
    };

    const validateArticle = () => {
        if (!article.title || !article.description || !article.image) {
            return false;
        }
        return true;
    };

    const handleToggleArchive = () => {
        if (isArchived && !validateArticle()) {
            toast.error('Неможливо розархівувати статтю. Перевірте, чи всі обов\'язкові поля заповнені.');
            return;
        }
        toggleArchiveStatus({ id: article.id });
        setIsDropdownOpen(false);
    };

    function truncateText(text: string, maxLength: number) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    }

    const formattedDate = new Date(article.createdAt).toISOString().split('T')[0];

    return (
        <div className="p-4 rounded-lg shadow-md relative cursor-pointer" onClick={handleEditArticle}>
            <img
                height={200}
                width={300}
                src={article.image}
                alt={article.title}
                className="mb-4 w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold mb-2 line-clamp-2">{truncateText(article.title, 100)}</h2>
            <div 
                className="text-gray-700 mb-2"
                dangerouslySetInnerHTML={{ __html: truncateText(article.description, 100) }}
            />
            <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>{formattedDate}</span>
            </div>
            <div className="absolute bottom-2 right-2" onClick={(e) => e.stopPropagation()}>
                <ActionsDropdown open={isDropdownOpen} setOpen={setIsDropdownOpen}>
                    <ActionItem onClick={handleViewArticle}>
                        Подивитись статтю
                    </ActionItem>
                    <ActionItem onClick={handleEditArticle}>
                        Редагувати статтю
                    </ActionItem>
                    <ActionItem onClick={handleToggleArchive}>
                        {isArchived ? 'Розархівувати статтю' : 'Архівувати статтю'}
                    </ActionItem>
                </ActionsDropdown>
            </div>
        </div>
    );
};

export default AdminArticleCard;
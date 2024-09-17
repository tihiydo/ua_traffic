'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const locale = useLocale();

    const handlePageChange = (page: number) => {
        router.push(`/${locale}/blog?page=${page}&q=${query}`);
    };

    if (totalPages <= 1) return null;

    const pageRange = 2;
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    const getButtonClass = (isActive: boolean, isDisabled: boolean) => {
        if (isDisabled) return 'bg-white text-slate-500 border-slate-500 cursor-not-allowed';
        if (isActive) return 'bg-yellow text-black border-slate-500';
        return 'bg-white text-slate-500 border-slate-500 hover:bg-yellow';
    };

    return (
        <div className="flex justify-center mt-8 space-x-2">
            <Button
                className={`px-4 py-2 rounded-lg border ${getButtonClass(false, currentPage === 1)}`}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            >
        &laquo;
            </Button>
            <Button
                className={`px-4 py-2 rounded-lg border ${getButtonClass(false, currentPage === 1)}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
        &larr;
            </Button>

            {startPage > 1 && (
                <>
                    <Button
                        className={`px-4 py-2 rounded-lg border ${getButtonClass(false, false)}`}
                        onClick={() => handlePageChange(1)}
                    >
            1
                    </Button>
                    {startPage > 2 && <span className="px-4 py-2">...</span>}
                </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <Button
                    key={page}
                    className={`px-4 py-2 rounded-lg border ${getButtonClass(currentPage === page, false)}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </Button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-4 py-2">...</span>}
                    <Button
                        className={`px-4 py-2 rounded-lg border ${getButtonClass(false, false)}`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                className={`px-4 py-2 rounded-lg border ${getButtonClass(false, currentPage === totalPages)}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
        &rarr;
            </Button>
            <Button
                className={`px-4 py-2 rounded-lg border ${getButtonClass(false, currentPage === totalPages)}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
        &raquo;
            </Button>
        </div>
    );
};

export default Pagination;
'use client';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');
    const locale = useLocale();
    const t = useTranslations('Blog');

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                router.push(`/${locale}/blog?q=${encodeURIComponent(query)}`);
            } else {
                router.push(`/${locale}/blog`);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [query, router, locale]);


    const handleClear = () => {
        setQuery('');
        router.push(`/${locale}/blog`);
    };

    return (
        <div className="w-72 flex mb-4 relative">
            <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none"
                placeholder={t('search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-slate-500 focus:outline-none"
                >
                    &times;
                </button>
            )}
        </div>
    );
};

export default SearchBar;
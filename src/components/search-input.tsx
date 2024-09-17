'use client'

import { useEffect, useState } from 'react'
import { Input, type InputProps } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { useTranslations } from 'next-intl'
import { twMerge } from 'tailwind-merge'

type Props = {
    onChange?: (value: string) => void;
    defaultValue?: string;
} & Omit<InputProps, 'onChange'>

const SearchInput = ({ onChange, defaultValue, className, ...props }: Props) => {
    const t = useTranslations('Default');
    const [search, setSearch] = useState(defaultValue ?? '');
    const debouncedValue = useDebounce(search)

    useEffect(() => {
        onChange?.(debouncedValue)
    }, [debouncedValue]);

    return (
        <div className='relative'>
            <Input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                placeholder={t("search")}
                className={twMerge("py-1.5 pl-10 h-[3rem] w-full", className)}
                {...props}
            />

            <div className="absolute  left-3 top-1/2 -translate-y-1/2 text-gray-secondary">
                <SearchIcon size={20} />
            </div>
        </div>
    )
}

export default SearchInput
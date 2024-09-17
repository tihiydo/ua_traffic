'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { useCatalogParams } from '../../hooks/use-catalog-params'
import { useTranslations } from 'next-intl'

const SearchInput = () => {
    const defaultT = useTranslations('Default');
    const { update, remove, schemaParams } = useCatalogParams();
    const [search, setSearch] = useState(schemaParams.search ?? '');
    const debouncedValue = useDebounce(search)

    useEffect(() => {
        if (!debouncedValue) {
            return remove('search')
        }
        update('search', debouncedValue)
    }, [debouncedValue]);

    return (
        <div className='relative w-fit h-fit'>
            <Input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                placeholder={defaultT("search")}
                className="h-fit max-w-sm py-1.5 pl-10"
            />

            <div className="absolute  left-3 top-1/2 -translate-y-1/2 text-gray-secondary">
                <SearchIcon size={20} />
            </div>
        </div>
    )
}

export default SearchInput
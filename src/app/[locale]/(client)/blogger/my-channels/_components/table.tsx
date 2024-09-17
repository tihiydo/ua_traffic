'use client'

import { DataTable } from './data-table'
import { api } from '@/trpc/react'
import React, { useMemo, useState } from 'react'
import { columns } from './columns'
import { type FiltersData } from './filters'
import Translate from '@/components/Translate'

const Table = () => {
    const { data: bloggers, isLoading } = api.blogger.getAllMyChannels.useQuery();
    const [filters, setFilters] = useState<FiltersData>({});

    const filteredBloggers = useMemo(() => {
        let filteredBloggers = bloggers ?? [];
        if (filters?.social) {
            filteredBloggers = filteredBloggers.filter((blogger) => (
                blogger.type.toLocaleLowerCase() === filters.social
            ))
        }

        if (filters?.bloggerStatus) {
            filteredBloggers = filteredBloggers.filter((blogger) => (
                blogger.status.toLocaleLowerCase() === filters.bloggerStatus
            ))
        }

        return filteredBloggers
    }, [filters, bloggers])

    const handleFiltersChange = (newFilters: FiltersData) => {
        setFilters(newFilters);
    };

    return (
        <div className='space-y-4'>
            <h1 className="text-[30px] leading-[35px] font-bold">
                <Translate namespace="Blogger" itemKey="mychannels" />
            </h1>
            
            <DataTable
                isLoading={isLoading}
                findBy='username'
                columns={columns}
                data={filteredBloggers}
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />
        </div>
    )
}

export default Table
'use client'

import { DataTable } from './data-table';
import { api } from '@/trpc/react';
import React, { useState, useMemo } from 'react'
import { columns } from './columns';
import { SocialType } from '@prisma/client';
import BloggerFilters, { FiltersData } from './filters';

type Props = {
    socialType: SocialType
}

const Table = (props: Props) => {
    const { data: bloggers, isLoading } = api.admin.blogger.getModerationBloggers.useQuery(undefined, {
        refetchOnWindowFocus: false
    });

    const [filters, setFilters] = useState<FiltersData>({});

    const filteredBloggers = useMemo(() => {
        let filtered = bloggers?.filter((el) => el.type == props.socialType) ?? [];

        if (filters.status) {
            filtered = filtered.filter(blogger => blogger.status.toLowerCase() === filters.status);
        }

        if (filters.category) {
            filtered = filtered.filter(blogger => blogger.categories.includes(filters.category ?? ''));
        }

        return filtered;
    }, [bloggers, props.socialType, filters]);

    const handleFiltersChange = (newFilters: FiltersData) => {
        setFilters(newFilters);
    };

    return (
        <div>
            <DataTable 
                findBy='username' 
                columns={columns} 
                data={filteredBloggers} 
                isLoading={isLoading}
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />
        </div>
    )
}

export default Table
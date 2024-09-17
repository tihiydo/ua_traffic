'use client'

import { DataTable } from './data-table'
import { api } from '@/trpc/react'
import React, { useMemo, useState } from 'react'
import { columns } from './columns'
import Filters, { type FiltersData } from './filters'
import Translate from '@/components/Translate'

const Table = () => {
    const { data: advertisments, isLoading } = api.advertisment.posts.getMyPosts.useQuery();
    const [filters, setFilters] = useState<FiltersData>({});

    const filteredAdvertisments = useMemo(() => {
        let filteredAdvertisments = advertisments ?? [];

        if (filters?.social) {
            filteredAdvertisments = filteredAdvertisments.filter((advertisment) => (
                advertisment?.social.toLowerCase() === filters.social
            ))
        }

        if (filters?.moderationStatus) {
            filteredAdvertisments = filteredAdvertisments.filter((advertisment) => (
                advertisment.status?.toLowerCase() === filters.moderationStatus
            ))
        }

        return filteredAdvertisments
    }, [filters, advertisments])

    const handleFiltersChange = (newFilters: FiltersData) => {
        setFilters(newFilters);
    };

    return (
         <div className='space-y-4'>
            <h1 className="text-[30px] leading-[35px] font-bold">
                <Translate namespace="Advertiser" itemKey="orders" />
            </h1>
            
            <DataTable
                isLoading={isLoading}
                findBy='username'
                columns={columns}
                data={filteredAdvertisments}
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />
        </div>
    )
}

export default Table
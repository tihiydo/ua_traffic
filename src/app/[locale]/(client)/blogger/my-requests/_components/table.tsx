'use client'

import { DataTable } from './data-table'
import { api } from '@/trpc/react'
import React, { useMemo, useState } from 'react'
import { columns } from './columns'
import Filters, { type FiltersData } from './filters'
import Translate from '@/components/Translate'

const Table = () => {
    const { data: advertismentRequests, isLoading } = api.advertisment.requests.getMyBloggersRequests.useQuery();
    const [filters, setFilters] = useState<FiltersData>({});

    const filteredAdvertisments = useMemo(() => {
        let filteredAdvertisments = advertismentRequests ?? [];

        if (filters?.social) {
            filteredAdvertisments = filteredAdvertisments.filter((advertismentRequest) => (
                advertismentRequest.Blogger?.type.toLowerCase() === filters.social
            ))
        }

        if (filters?.requestStatus) {
            filteredAdvertisments = filteredAdvertisments.filter((advertismentRequest) => (
                advertismentRequest.status?.toLowerCase() === filters.requestStatus
            ))
        }

        return filteredAdvertisments
    }, [filters, advertismentRequests])

    const handleFiltersChange = (newFilters: FiltersData) => {
        setFilters(newFilters);
    };

    return (
         <div className='space-y-4'>
            <h1 className="text-[30px] leading-[35px] font-bold">
                <Translate namespace="Blogger" itemKey="myorders" />
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
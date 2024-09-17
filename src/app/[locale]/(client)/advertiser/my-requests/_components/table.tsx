'use client'

import Translate from '@/components/Translate'
import { DataTable } from './data-table'
import { api } from '@/trpc/react'
import { useMemo, useState } from 'react'
import { columns } from './columns'
import Filters, { type FiltersData } from './filters'

const Table = () => {
    const { data: advertismentRequests, isLoading } = api.advertisment.requests.getMyAdvertiserRequests.useQuery();
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
                <Translate namespace="Advertiser" itemKey="mysposts" />
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
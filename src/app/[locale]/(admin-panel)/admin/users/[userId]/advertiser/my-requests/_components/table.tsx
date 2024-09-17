'use client'

import { DataTable } from '@/components/ui/custom/data-table'
import { api } from '@/trpc/react'
import React, { useMemo, useState } from 'react'
import { columns } from './columns'
import Filters, { type FiltersData } from './filters'

type Props = {
    userId: string
}

const Table = (props: Props) => {
    const { data: advertismentRequests, isLoading } = api.advertisment.requests.getMyAdvertiserRequests.useQuery({userId: props.userId});
    const [filters, setFilters] = useState<FiltersData>();

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

    return (
        <DataTable
            isLoading={isLoading}
            findBy='username'
            columns={columns}
            data={filteredAdvertisments}
            filters={
                <Filters
                    filters={filters}
                    onChange={(data: FiltersData) => {
                        setFilters(data)
                    }}
                />
            }
        />
    )
}

export default Table
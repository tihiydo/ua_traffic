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
    const { data: advertisments, isLoading } = api.advertisment.posts.getMyPosts.useQuery({userId: props.userId});
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

    return (
        <DataTable
            isLoading={isLoading}
            findBy='title'
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
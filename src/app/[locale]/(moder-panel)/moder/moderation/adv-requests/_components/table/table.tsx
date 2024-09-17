'use client'

import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/react'
import React, { useMemo, useState } from 'react'
import Filters, { type FiltersData } from './filters';
import { columns } from './columns';
import { SocialType } from '@prisma/client';

type Props = 
{
    socialType: SocialType
}

const AdvRequestsPage = (props: Props) => 
{
    const { data: advertisments, isLoading } = api.admin.advertisment.getRequests.useQuery();

    const [filters, setFilters] = useState<FiltersData>();

    const filteredAdvertisments = useMemo(() => {
        let filteredAdvertisments = advertisments ?? [];

        filteredAdvertisments = filteredAdvertisments?.filter((el) => el.AdvertismentPost.social == props.socialType)

        if (filters?.requestStatus) {
            filteredAdvertisments = filteredAdvertisments.filter((advertismentRequest) => (
                advertismentRequest.status?.toLowerCase() === filters.requestStatus
            ))
        }

        return filteredAdvertisments
    }, [filters, advertisments])
    return (
        <div>
            <DataTable
                findBy='title'
                isLoading={isLoading}
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
        </div>
    )
}

export default AdvRequestsPage
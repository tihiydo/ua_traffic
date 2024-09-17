"use client";

import { DataTable } from './data-table';
import { api } from '@/trpc/react';
import React, { useMemo, useState } from 'react';
import Filters, { type FiltersData } from './filters';
import { columnsInstagram } from './columns-instagram';
import { columnsTelegram } from './columns-telegram';
import { Prisma, SocialType } from '@prisma/client';

export type ModerateAdReqTableData = Prisma.AdvertismentRequestGetPayload<{ include: { Blogger: true, AdvertismentPost: true, Chat: true } }>;

type Props = {
    socialType: SocialType;
}

const AdvRequestsPage = (props: Props) => {
    const { data: advertisments, isLoading } = api.admin.advertisment.getRequests.useQuery();

    const [filters, setFilters] = useState<FiltersData>({});

    const filteredAdvertisments = useMemo(() => {
        let filteredAdvertisments = advertisments ?? [];
        filteredAdvertisments = filteredAdvertisments?.filter((el) => el.AdvertismentPost.social === props.socialType);

        if (filters?.requestStatus) {
            filteredAdvertisments = filteredAdvertisments.filter((advertismentRequest) => (
                advertismentRequest.status?.toLowerCase() === filters.requestStatus
            ));
        }

        return filteredAdvertisments;
    }, [filters, advertisments]);

    const handleFiltersChange = (newFilters: FiltersData) => {
        setFilters(newFilters);
    };

    return (
        <div>
            <DataTable
                findBy='title'
                isLoading={isLoading}
                columns={props.socialType === "Instagram" ? columnsInstagram : columnsTelegram}
                data={filteredAdvertisments}
                filters={filters} 
                onFiltersChange={handleFiltersChange}
            />
        </div>
    );
}

export default AdvRequestsPage;

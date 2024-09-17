'use client'

import { DataTable } from './data-table';
import { api } from '@/trpc/react';
import { useMemo, useState } from 'react';
import Filters, { type FiltersData } from './filters';
import { SocialType } from '@prisma/client';
import { columnsInstagram } from './columns-instagram';
import { columnsTelegram } from './columns-telegram';

type Props = {
    socialType: SocialType;
}

const AdvertismentsModerationTable = (props: Props) => {
    const { data: advertisments, isLoading } = api.admin.advertisment.getModerationAdvertisments.useQuery();

    const [filters, setFilters] = useState<FiltersData>({});

    const filteredAdvertisments = useMemo(() => {
        let filteredAdvertisments = advertisments ?? [];

        filteredAdvertisments = filteredAdvertisments?.filter((el) => el.social == props.socialType);

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

export default AdvertismentsModerationTable;

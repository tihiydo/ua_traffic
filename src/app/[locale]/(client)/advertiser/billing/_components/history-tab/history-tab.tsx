import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/react'
import React, { useMemo, useState } from 'react'
import { columns } from './columns';
import Filters, { type FiltersData } from './filters';


const HistoryTab = () => {
    const { data: history, isLoading } = api.advertiser.transactions.getMyHistoy.useQuery();
    const [filters, setFilters] = useState<FiltersData>({ type: 'All' });

    const filteredHistory = useMemo(() => {
        let filteredHistory = history ?? [];

        if (filters?.type) {
            filteredHistory = filteredHistory.filter((item) => {
                if (filters.type === 'All') return true;

                return item.type === filters.type
            })
        }

         if (filters?.status) {
            filteredHistory = filteredHistory.filter((item) => {
                if (filters.status === 'All') return true;

                if ('status' in item) {
                    return item.status === filters.status;
                }
                return false;
            })
        }

        return filteredHistory
    }, [filters, history])

    return (
        <DataTable
            columns={columns}
            findBy={'createdAt'}
            data={filteredHistory ?? []}
            isLoading={isLoading}
            filters={<Filters onChange={setFilters} filters={filters} />}
        />
    )
}

export default HistoryTab
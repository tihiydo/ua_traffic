'use client'

import { DataTable } from '@/components/ui/custom/data-table'
import { api } from '@/trpc/react'
import { columns } from './columns'
import Filters, { type FiltersData } from './filters'
import { useMemo, useState } from 'react'
import { BloggerTransactionType } from '@/types/history/blogger'

const HistoryTab = () => {
    const { data: history, isLoading } = api.blogger.transactions.getMyHistory.useQuery();
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
        <div>
            <DataTable
                findBy='createdAt'
                isLoading={isLoading}
                columns={columns}
                data={filteredHistory ?? []}
                filters={<Filters onChange={setFilters} filters={filters} />}
            />
        </div>
    )
}

export default HistoryTab
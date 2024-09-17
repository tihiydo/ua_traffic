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
    const { data: bloggers, isLoading } = api.blogger.getAllMyChannels.useQuery({userId: props.userId});
    const [filters, setFilters] = useState<FiltersData>({});

    const filteredBloggers = useMemo(() => {
        let filteredBloggers = bloggers ?? [];
        if (filters?.social) {
            filteredBloggers = filteredBloggers.filter((blogger) => (
                blogger.type.toLocaleLowerCase() === filters.social
            ))
        }

        if (filters?.bloggerStatus) {
            filteredBloggers = filteredBloggers.filter((blogger) => (
                blogger.status.toLocaleLowerCase() === filters.bloggerStatus
            ))
        }

        return filteredBloggers
    }, [filters, bloggers])

    return (
        <DataTable
            isLoading={isLoading}
            findBy='username'
            columns={columns}
            data={filteredBloggers}
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
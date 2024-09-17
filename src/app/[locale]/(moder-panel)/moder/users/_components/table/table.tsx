'use client'

import { DataTable } from '@/components/ui/custom/data-table';
import { api } from '@/trpc/react';
import React, { useMemo, useState } from 'react'
import { columns } from './columns';
import Filters, { type FiltersData } from '../../filters';


const Table = () => {
    const { data: users, isLoading } = api.admin.users.getUsers.useQuery();

    const [filters, setFilters] = useState<FiltersData>();

    const filteredUsers = useMemo(() => {
        let filteredUsers = users ?? [];

        if (filters?.isActive) {
            filteredUsers = filteredUsers.filter((user) =>
                (
                    (filters.isActive == "all")
                ||
                (filters.isActive == "banned" && user.banned == true)
                ||
                (filters.isActive == "notbanned" && user.banned == false)
                ))
        }

        return filteredUsers
    }, [filters, users])

    return (
        <DataTable findBy='email' columns={columns} data={filteredUsers} isLoading={isLoading}
            filters={
                <Filters
                    filters={filters}
                    onChange={(data: FiltersData) => {
                        setFilters(data)
                    }}
                />
            } />
    )
}

export default Table
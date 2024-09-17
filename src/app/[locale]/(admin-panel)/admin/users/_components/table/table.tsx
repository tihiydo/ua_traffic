'use client'

import { DataTable } from './data-table';
import { api } from '@/trpc/react';
import React, { useMemo, useState } from 'react'
import { columns } from './columns';
import Filters, { type FiltersData } from '../../filters';


const Table = () => {
    const { data: users, isLoading } = api.admin.users.getUsers.useQuery();

    const [filters, setFilters] = useState<FiltersData>({ isActive: "all" });

    const filteredUsers = useMemo(() => {
        let filteredUsers = users ?? [];
        filteredUsers = filteredUsers.filter((user) => {
            return user.id !== "ADMIN"
        })
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

    const handleFiltersChange = (newFilters: FiltersData) => {
        setFilters(newFilters);
    }

    return (
        <DataTable findBy='email' columns={columns} data={filteredUsers} isLoading={isLoading}
            filters={
                filters
            }
            onFiltersChange={handleFiltersChange}
        />
    )
}

export default Table
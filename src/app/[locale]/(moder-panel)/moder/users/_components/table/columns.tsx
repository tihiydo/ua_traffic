'use client'

import type { ColumnDef } from "@tanstack/react-table";
import { type User } from "@prisma/client";
import UserStatusBadge from "@/components/ui/custom/badges/statuses/user";
import BanButton from "./simply-button/ban";


export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },

    {
        accessorKey: "name",
        header: "Ім'я",
        cell: ({ row }) => {
            const user = row.original;
            return user.name ? user.name : 'Невідомо'
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        header: 'Телефон',
        cell: ({ row }) => {
            const user = row.original;
            return user.tel ? user.tel : 'Номер відсутний'
        }
    },
    {
        header: 'Статус',
        cell: ({ row }) => {
            const user = row.original;

            return <UserStatusBadge status={user.banned} />
        }
    },
    {
        header: "Модерація",
        cell: ({ row }) => {
            const user = row.original;
            return <BanButton user={user} />
        }
    },
];

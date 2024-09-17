'use client'

import type { ColumnDef } from "@tanstack/react-table";
import { type Referrals } from "@prisma/client";
import { format } from "date-fns";
import Translate from "@/components/Translate";


export const columns: ColumnDef<Referrals>[] = [
    {
        accessorKey: "email",
        header: () => <Translate namespace="Profile.Referral" itemKey="email-header" />,
        cell: ({ row }) => {
            const user = row.original;
            return user.guestEmail;
        }
    },

    {
        accessorKey: "dateTime",
        header: () => <Translate namespace="Profile.Referral" itemKey="invited-at-header" />,
        cell: ({ row }) => {
            const user = row.original;
            return format(user.guestInvitedDate, 'dd.MM.yyyy HH:mm')
        }
    }
];

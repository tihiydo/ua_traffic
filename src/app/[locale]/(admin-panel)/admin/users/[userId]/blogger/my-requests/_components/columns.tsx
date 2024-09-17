'use client'

import { Button } from "@/components/ui/button";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, ClockIcon, Eye } from "lucide-react";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type Prisma } from "@prisma/client";
import Translate from "@/components/Translate";
import AcceptDeclineButtons from "./actions-cell/accept-decline-buttons";
import DoneButton from "./actions-cell/done-button";
import DateRange from "@/components/date-range";
import { Link, useRouter } from "@/i18n/navigation";
import DateFormat from "@/components/date-format";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import AdvertismentRequestStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-request";
import { isAfter } from "date-fns";

export type TableData = Prisma.AdvertismentRequestGetPayload<{ include: { Blogger: true, AdvertismentPost: true, Chat: true } }>;

const ActionsCell = ({ row }: CellContext<TableData, unknown>) => {
    return <ActionsDropdown>
        <ActionItem>
            <Link href={`my-requests/${row.original.id}`} className="flex items-center gap-x-2">
                <Eye size={18} />
                <Translate namespace="Blogger" itemKey="watch" />
            </Link>
        </ActionItem>
    </ActionsDropdown>
}

export const columns: ColumnDef<TableData>[] = [
    {
        id: "select",
        header: "#",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
                {row.index + 1}
            </div>
        ),
    },
    {
        id: 'Назва',
        header: () => {
            return <Translate namespace='Blogger' itemKey="postname" />
        },
        cell: ({ row }) => (
            row.original.AdvertismentPost.title
        )
    },
    {
        accessorFn: ({ Blogger }) => Blogger?.username,
        accessorKey: 'username',
        header: () => {
            return <Translate namespace="Blogger" itemKey="channel" />
        }

    },
    {
        header: () => {
            return <Translate namespace="Blogger" itemKey="typepost" />
        },
        accessorKey: "posttype",
        cell: ({ row }) => {
            const advertismentReq = row.original;

            return <div>
                <Translate namespace="Socials" itemKey={advertismentReq.AdvertismentPost.social} />
                {' - '}
                <Translate namespace="Post-Types" itemKey={advertismentReq.type} />
            </div>
        },
    },
    {
        header: () => {
            return <Translate namespace="Blogger" itemKey="publishdate" />
        },
        accessorKey: "postdate",
        cell: ({ row }) => {
            const advertisment = row.original;

            if (advertisment.status === 'New') {
                return <DateRange dateFrom={advertisment.dateFrom} dateTo={advertisment.dateTo} />
            }

            if (advertisment.exactDate) {
                return <DateFormat className="text-center" date={advertisment.exactDate} />
            }

            return <DateRange dateFrom={advertisment.dateFrom} dateTo={advertisment.dateTo} />
        },
    },

    {
        id: 'price',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="h-12 px-4 text-left align-middle font-bold text-sm uppercase [&:has([role=checkbox])]:pr-0 dark:text-slate-400"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Translate namespace="Blogger" itemKey="price" />
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

        cell: ({ row }) => {
            const advertismentRequest = row.original;

            return `${advertismentRequest.price} ₴`
        }
    },
    {
        header: () => {
            return <Translate namespace="Blogger" itemKey="status" />
        },
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.original.status;

            return <AdvertismentRequestStatusBadge status={status} />
        },
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];

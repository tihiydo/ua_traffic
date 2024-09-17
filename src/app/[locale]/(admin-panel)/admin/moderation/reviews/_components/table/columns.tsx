'use client'

import { type ModerateReviewTableData } from "./table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Translate from "@/components/Translate";
import DateFormat from "@/components/date-format";
import ActionsCell from "./action-cell";
import ModerateReviewButton from "../moderate-review-button";
import ReviewStatusBadge from '@/components/ui/custom/badges/statuses/reivew-status';

export const columns: ColumnDef<ModerateReviewTableData>[] = [
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
        accessorKey: 'Username',
        header: "E-mail Користувача",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.advertiser?.email}
            </div>
        ),
    },
    {
        accessorKey: 'text',
        header: "Текст відгука",
    },
    {
        accessorKey: 'createdAt',
        header: "Дата створення",
        cell: ({ row }) => <DateFormat date={row.original.createdAt} />
    },
    {
        header: 'Статус',
        cell: ({ row }) => {
            const reviewStatus = row.original;

            return <ReviewStatusBadge status={reviewStatus.status} />
        }
    },
    {
        id: 'moderate',
        header: 'Модерація',
        cell: ({ row }) => {
            if (row.original.status === 'Pending') {
                return <ModerateReviewButton reviewId={row.original.id} />
            }
            return null;
        }
    },
    {
        id: 'actions',
        header: "Дії",
        cell: ActionsCell
    }
];
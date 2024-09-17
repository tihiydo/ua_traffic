'use client'

import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { type WithdrawTransaction } from "@prisma/client";
import { Checkbox } from "@radix-ui/react-checkbox";
import MarkAsDoneButton from "./markAsDoneButtont";
import { CheckCircle2Icon } from "lucide-react";
import { format } from "date-fns";
import WithdrawTransactionStatusBadge from "@/components/ui/custom/badges/statuses/withdraw-transaction";

type TableData = WithdrawTransaction;

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
        header: "Дата",
        cell: ({ row }) => {
            const transaction = row.original;

            return format(transaction.createdAt, 'dd.MM.yyyy HH:mm')
        },
    },

    {
        header: "Сума",
        cell: ({ row }) => {
            const transaction = row.original;

            return <p>{transaction.realAmount} ₴</p>
        },
    },
    {
        header: "Картка",
        cell: ({ row }) => {
            const transaction = row.original;

            return transaction.cardNumber
        },
    },

    {
        header: "ФІО",
        cell: ({ row }) => {
            const transaction = row.original;
            return transaction.fio
        },
    },

    {
        header: "Банк",
        cell: ({ row }) => {
            const transaction = row.original;
            return transaction.cardBank
        },
    },

    {
        header: "Статус",
        cell: ({ row }) => {
            const status = row.original.status;

            return <WithdrawTransactionStatusBadge status={status} />;
        },
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const transaction = row.original;

            if (transaction.status === 'Processing') {
                return <MarkAsDoneButton transaction={transaction} />
            }

            if (transaction.status === 'Done') {
                return <div className="text-success flex items-center gap-2 font-bold pointer-events-none">
                    <CheckCircle2Icon />
                    Оплачено
                </div>
            }
        }
    },
];

import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Translate from "@/components/Translate";
import WithdrawTransactionStatusBadge from "@/components/ui/custom/badges/statuses/withdraw-transaction";
import { format } from "date-fns";
import { BloggerTransactionType, type BloggerHistoryItem } from "@/types/history/blogger";
import BloggerRequestTransactionStatusBadge from "@/components/ui/custom/badges/statuses/blogger-request-tansaction";
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";


export const columns: ColumnDef<BloggerHistoryItem>[] = [
   {
        id: 'type',
        header: () => {
            return <Translate namespace="Transaction" itemKey="transaction-type" />
        },
        cell: ({ row }) => {
            const transaction = row.original;
            return <div className={cn('font-bold flex items-center gap-2', 
                transaction.type === BloggerTransactionType.Withdraw ? "text-destructive" : 
                transaction.type === BloggerTransactionType.Transfer ? "text-warning" : 'text-success')}>
                
                {transaction.type === BloggerTransactionType.Withdraw
                    ? (<ChevronDownIcon />)
                    : transaction.type === BloggerTransactionType.Transfer
                    ? (<ArrowRightIcon />)
                    : (<ChevronUpIcon />)
                }
                <Translate namespace='Transaction.Blogger' itemKey={`${transaction.type}.name`} />
            </div>
        }
    },
    {
        id: "postname",
        header: () => {
            return <p className="text-center">
                <Translate namespace="Default" itemKey="name" />
            </p>
        },
        cell: ({ row }) => {
            if (row.original.type === 'Request') {
                return <div className="flex justify-center">
                    {row.original.Request.AdvertismentPost.title}
                </div>
            }

            return <div className="flex justify-center">
                <MinusIcon className="text-main/70" />
            </div>
        }
    },
    {
        id: "createdAt",
        accessorFn: ({ createdAt }) => {
            return format(createdAt, 'dd.MM.yyyy HH:mm')
        },
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="date" />
            </p>
        },
        cell: ({ row }) => (
            <div className="flex justify-center">
                {format(row.original.createdAt, 'dd.MM.yyyy HH:mm')}
            </div>
        )
    },
    {
        id: "amount",
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="ammount" />
            </p>
        },
        cell: ({ row }) => {
            const transaction = row.original;
            return (
                <p className="text-center font-medium">{transaction.type === 'Withdraw' ? transaction.realAmount : transaction.amount} ₴</p>
            )
        }
    },
    {
        id: 'card',
        cell: ({ row }) => {
            const transaction = row.original;
            return <div className="flex justify-center">
                {transaction.type === 'Withdraw'
                    ? transaction.cardNumber
                    : <MinusIcon className="text-main/70" />}
            </div>
        },
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="details" />
            </p>
        },
    },

    {
        id: 'status',
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="status" />
            </p>
        },
        cell: ({ row }) => {
            const transaction = row.original;
            return (<div className="flex justify-center">
                {transaction.type === BloggerTransactionType.Withdraw
                    ? (<WithdrawTransactionStatusBadge status={transaction.status} />)
                    : transaction.type === BloggerTransactionType.Request
                    ? (<BloggerRequestTransactionStatusBadge status={transaction.status} />)
                    : '-'
                }
            </div>)
        },
    }
];
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Translate from "@/components/Translate";
import WithdrawTransactionStatusBadge from "@/components/ui/custom/badges/statuses/withdraw-transaction";
import { format } from "date-fns";
import { type BloggerHistoryItem } from "@/types/history/blogger";
import BloggerRequestTransactionStatusBadge from "@/components/ui/custom/badges/statuses/blogger-request-tansaction";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, ArrowRightIcon, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<BloggerHistoryItem>[] = [
    {
        id: 'type',
        header: () => {
            return <Translate namespace="Transaction" itemKey="transaction-type" />
        },
        cell: ({ row }) => {
            const transaction = row.original;

            const isSendingToAdvertiser = transaction.type === 'Transfer' && transaction.toAccount === 'advertiser';
            const isReceivingFromAdvertiser = transaction.type === 'Transfer' && transaction.fromAccount === 'advertiser';

            
            return <div className={cn('font-bold flex items-center gap-2', 
                transaction.type === 'Withdraw' ? "text-destructive" :
                    transaction.type === 'Request' ? "text-success" : 
                        transaction.type === 'Transfer' ? "text-warning" : 'text-destructive')}>
                
                {transaction.type === 'Withdraw'
                    ? (<ChevronDownIcon />)
                    : transaction.type === 'Transfer'
                        ? isSendingToAdvertiser
                            ? (<Redo />) 
                            : isReceivingFromAdvertiser
                                ? (<Undo />)
                                : (<MinusIcon />)
                        : (<ChevronUpIcon />)
                }
                {transaction.type === 'Withdraw' || transaction.type === 'Request'
                    ? <Translate namespace='Transaction.Blogger' itemKey={`${transaction.type}.name`} />
                    : isSendingToAdvertiser
                        ? <Translate namespace='Transaction.Blogger' itemKey={`${transaction.type}.name`} />
                        : <Translate namespace='Transaction.Advertiser' itemKey={`${transaction.type}.name`} />
                }
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
                <p className="text-center font-medium">
                    {transaction.type === 'Withdraw' ? transaction.realAmount : transaction.amount} ₴
                </p>
            )
        }
    },
    {
        id: 'details',
        cell: ({ row }) => {
            const transaction = row.original;
            if (transaction.type === 'Withdraw') {
                return <div className="flex justify-center">{transaction.cardNumber}</div>
            }
            if (transaction.type === 'Transfer') {
                return <div className="flex justify-center"><MinusIcon className="text-main/70" /></div>
            }
            return <div className="flex justify-center"><MinusIcon className="text-main/70" /></div>
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
            if (transaction.type === 'Withdraw') {
                return (
                    <div className="flex justify-center">
                        <WithdrawTransactionStatusBadge status={transaction.status} />
                    </div>
                )
            }
            if (transaction.type === 'Request') {
                return (
                    <div className="flex justify-center">
                        <BloggerRequestTransactionStatusBadge status={transaction.status} />
                    </div>
                )
            }
            return <div className="flex justify-center">-</div>
        },
    }
];
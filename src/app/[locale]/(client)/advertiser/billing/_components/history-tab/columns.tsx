import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Translate from "@/components/Translate";
import DepositTransactionStatusBadge from "@/components/ui/custom/badges/statuses/deposit-transaction";
import { Link } from "@/i18n/navigation";
import { type AdvertiserHistoryItem } from "@/types/history/advertiser";
import AdvertiserRequestTransactionStatusBadge from "@/components/ui/custom/badges/statuses/advertiser-request-tansaction";
import { format } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon, LinkIcon, ChevronDownIcon, ChevronUpIcon, MinusIcon, Redo, Undo } from "lucide-react";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<AdvertiserHistoryItem>[] = [
    {
        id: 'type',
        header: () => {
            return <Translate namespace="Transaction" itemKey="transaction-type" />
        },
        cell: ({ row }) => {
            const transaction = row.original;

            const isSendingToBlogger = transaction.type === 'Transfer' && transaction.toAccount === 'blogger';
            const isReceivingFromBlogger = transaction.type === 'Transfer' && transaction.fromAccount === 'blogger';

            return (
                <div className={cn(
                    'font-bold flex items-center gap-2', 
                    transaction.type === 'Request' ? "text-destructive" : 
                        transaction.type === 'Deposit' ? "text-success" : 
                            transaction.type === 'Transfer' ? "text-warning" : 
                                'text-destructive'
                )}>
                    {transaction.type === 'Request'
                        ? (<ChevronDownIcon />)
                        : transaction.type === 'Transfer'
                            ? isSendingToBlogger
                                ? (<Redo />) 
                                : isReceivingFromBlogger
                                    ? (<Undo />)
                                    : (<MinusIcon />)
                            : (<ChevronUpIcon />)
                    }
                    {transaction.type === 'Request' || transaction.type === 'Deposit'
                        ? <Translate namespace='Transaction.Advertiser' itemKey={`${transaction.type}.name`} />
                        : isSendingToBlogger
                            ? <Translate namespace='Transaction.Advertiser' itemKey={`${transaction.type}.name`} />
                            : <Translate namespace='Transaction.Blogger' itemKey={`${transaction.type}.name`} />
                    }
                </div>
            );
        }
    },

    {
        id: "postname",
        header: () => {
            return <p>
                <Translate namespace="Default" itemKey="name" />
            </p>
        },
        cell: ({ row }) => {
            if (row.original.type === 'Request') {
                return <div>
                    {row.original.Request.AdvertismentPost.title}
                </div>
            }

            return <div>
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
            return <Translate namespace="Blogger" itemKey="date" />
        },
        cell: ({ row }) => (
            format(row.original.createdAt, 'dd.MM.yyyy HH:mm')
        )
    },

    {
        id: "amount",
        header: () => {
            return <Translate namespace="Advertiser" itemKey="amount" />
        },
        cell: ({ row }) => {
            const transaction = row.original;

            return (
                <p className="font-medium">{transaction.type === 'Deposit' ? transaction.realAmount : transaction.amount} ₴</p>
            )
        }
    },

    {
        id: 'details',
        cell: ({ row }) => {
            const transaction = row.original;
            if (transaction.type === 'Deposit') {
                return <div className="flex justify-center"><MinusIcon className="text-main/70" /></div>
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
            return <Translate namespace="Advertiser" itemKey="status" />
        },
        cell: ({ row }) => {
            const transaction = row.original;

           if (transaction.type === 'Deposit') {
    if (transaction.status === 'Processing') {
        return (
            <DepositTransactionStatusBadge status="Processing" className="cursor-pointer relative">
                {!!transaction.paymentUrl && (
                    <Link href={transaction.paymentUrl} className="absolute w-full h-full left-0 top-0" />
                )}
                <div className="flex items-center justify-center w-full h-full">
                    <Translate namespace={`Transaction.Advertiser.Deposit.Status`} itemKey={'Processing'} />
                    <LinkIcon size={20} className="ml-2" />
                </div>
            </DepositTransactionStatusBadge>
        )
    }

    return <DepositTransactionStatusBadge status={transaction.status} />
}


            if (transaction.type === 'Request') {
                return <AdvertiserRequestTransactionStatusBadge status={transaction.status} />
            }
            return <div className="flex justify-center">-</div>
        },
    }
];
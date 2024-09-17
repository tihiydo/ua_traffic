import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Translate from "@/components/Translate";
import DepositTransactionStatusBadge from "@/components/ui/custom/badges/statuses/deposit-transaction";
import { Link } from "@/i18n/navigation";
import { type AdvertiserHistoryItem } from "@/types/history/advertiser";
import AdvertiserRequestTransactionStatusBadge from "@/components/ui/custom/badges/statuses/advertiser-request-tansaction";
import { format } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<AdvertiserHistoryItem>[] = [
    {
        id: 'type',
        header: () => {
            return <Translate namespace="Transaction" itemKey="transaction-type" />
        },
        cell: ({ row }) => {
            const transaction = row.original;

            return <div className={cn('font-bold flex items-center gap-2', transaction.type === 'Request' ? "text-destructive" : 'text-success')}>

                {transaction.type === 'Request'
                    ? (<ChevronDownIcon />)
                    : (<ChevronUpIcon />)
                }
                <Translate namespace='Transaction.Advertiser' itemKey={`${transaction.type}.name`} />
            </div>
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
        id: 'status',
        header: () => {
            return <Translate namespace="Advertiser" itemKey="status" />
        },
        cell: ({ row }) => {
            const transaction = row.original;

            if (transaction.type === 'Deposit') {
                if (transaction.status === 'Processing') {
                    return <DepositTransactionStatusBadge status="Processing" className="cursor-pointer relative">
                        {!!transaction.paymentUrl && <Link href={transaction.paymentUrl} className="absolute w-full h-full left-0 top-0" />}


                        <Translate namespace={`Transaction.Advertiser.Deposit.Status`} itemKey={'Processing'} />
                    </DepositTransactionStatusBadge>
                }

                return <DepositTransactionStatusBadge status={transaction.status} />
            }

            if (transaction.type === 'Request') {
                return <AdvertiserRequestTransactionStatusBadge status={transaction.status} />
            }
        },
    }
];
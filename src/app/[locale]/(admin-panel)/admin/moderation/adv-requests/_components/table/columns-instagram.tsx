'use client'


import { type ModerateAdReqTableData } from "./table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import DateRange from "@/components/date-range";
import DateFormat from "@/components/date-format";
import AdvertismentRequestStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-request";
import ModerateRequestButton from "../moderate-request";
import ActionsCell from "./actions-cell";

export const columnsInstagram: ColumnDef<ModerateAdReqTableData>[] = [
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
        accessorFn: ({ Blogger }) => Blogger?.username,
        accessorKey: 'username',
        header: () => {
            return <Translate namespace="Blogger" itemKey="channel" />
        }

    },
    {
        header: 'Назва',
        id: "title",
        accessorFn: (adv) => adv.AdvertismentPost.title
    },
    {
        header: () => {
            return <Translate namespace="Blogger" itemKey="typepost" />
        },
        accessorKey: "posttype",
        cell: ({ row }) => {
            const advertisment = row.original;

            return <>
                <Translate namespace="Socials" itemKey={row.original.AdvertismentPost.social} />

                {advertisment.type
                    ? <>
                        {' - '}
                        <Translate namespace="Post-Types" itemKey={advertisment.type} />
                    </>
                    : null}
            </>
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
        header: "Статус",
        cell: ({ row }) => {
            const status = row.original.status;

            return <AdvertismentRequestStatusBadge status={status} />
        },
    },
    {
        header: "Чат",
        cell: ({ row }) => {
            const request = row.original;

            if (!request.Chat) {
                return 'Чату не має'
            }

            return (
                <Button asChild variant={'link'}>
                    <Link href={`/admin/chatlist?chat=${request.Chat.id}`}>Перейти в чат</Link>
                </Button>
            )
        },
    },
    {
        accessorKey: "accept",
        header: () => {
            return <Translate namespace="Blogger" itemKey="acceptor" />
        },
        cell: ({ row }) => {
            const advertismentRequest = row.original;

            if (advertismentRequest.status === 'Moderating') {
                return <ModerateRequestButton requestId={advertismentRequest.id} />
            }
        }
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];

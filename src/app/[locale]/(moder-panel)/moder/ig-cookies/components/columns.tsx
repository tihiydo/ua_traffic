'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type { IGCookie } from "@prisma/client";
import DateFormat from "@/components/date-format";
import IGCookieStatusBadge from "./ig-cookie-status-badge";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { ToggleLeftIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Link, useRouter } from "@/i18n/navigation";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import EditCookieModal from "./edit-cookie-modal";
import { Button } from "@/components/ui/button";




const ActionsCell = ({ row: { original: cookie } }: CellContext<TableData, unknown>) => {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const toggleActiveCookie = api.admin.igCookie.toggleActiveCookie.useMutation({
        onSuccess: () => {
            router.refresh();
            setOpen(false)
        }
    });
    const deleteCookie = api.admin.igCookie.deleteCookie.useMutation({
        onSuccess: () => {
            router.refresh();
            setOpen(false)
        }
    });

    const disabled = toggleActiveCookie.isLoading || deleteCookie.isLoading

    return <ActionsDropdown open={open} setOpen={setOpen} classNames={{
        content: 'w-[230px]'
    }}>
        <ActionItem
            disabled={disabled}
            onClick={() => {
                toggleActiveCookie.mutate({ id: cookie.id })
            }}
        >
            {toggleActiveCookie.isLoading ? (
                <SpinnerLoading className="text-gray-secondary mx-auto" />
            ) : (
                <span className="flex items-center gap-x-2">
                    <ToggleLeftIcon size={18} />
                    Вимкнути/Ввімкнути
                </span>

            )}
        </ActionItem>

        <ActionItem
            disabled={disabled}
        >
            <EditCookieModal cookie={cookie} />
        </ActionItem>

        <ActionItem
            disabled={disabled}
            onClick={() => {
                deleteCookie.mutate({ id: cookie.id })
            }}
        >
            {deleteCookie.isLoading ? (
                <SpinnerLoading className="text-gray-secondary mx-auto" />
            ) : (
                <span className="flex items-center gap-x-2">
                    <Trash2 size={18} />
                    Видалити
                </span>
            )}
        </ActionItem>
    </ActionsDropdown>
}

type TableData = IGCookie

export const columns: ColumnDef<TableData>[] = [
    {
        accessorFn: (row) => {
            return row.name
        },
        header: "Назва",
    },
    {
        cell: ({ row }) => {
            const cookie = row.original;
            return <Button variant={'link'} asChild>
                <Link href={`https://www.instagram.com/${cookie.username}`} className="font-bold" target="_blank">
                    {cookie.username}
                </Link>
            </Button>
        },
        header: "Посилання на аккаунт",
    },
    {
        header: 'Статус',
        cell: ({ row }) => {
            const cookie = row.original;

            return <IGCookieStatusBadge status={cookie.status} />
        }
    },
    {
        header: 'Зломались в',
        cell: ({ row }) => {
            const cookie = row.original;

            return cookie.lastBrokeAt ? <DateFormat date={cookie.lastBrokeAt} /> : "Ще не ламались"
        }
    },
    {
        header: 'Востаннє використані',
        cell: ({ row }) => {
            const cookie = row.original;

            return cookie.lastUsed ? <DateFormat date={cookie.lastUsed} /> : "Ще не використовувались"
        }
    },
    {
        id: 'actions',
        header: 'Дії',
        cell: ActionsCell
    }
];

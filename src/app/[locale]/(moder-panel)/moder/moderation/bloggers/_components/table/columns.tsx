'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { type Prisma } from "@prisma/client";
import Translate from "@/components/Translate";
import BloggerStatusBadge from "@/components/ui/custom/badges/statuses/blogger";
import Link from "next/link";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { EditIcon, Eye, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { type Blogger } from "@/database/blogger";
import { StatusModerationCell } from "./status-moderation-cell";
import BloggerTagBadge from "@/components/ui/custom/badges/tags/blogger-tag-badge";



const ActionsCell = ({ row }: CellContext<TableData, unknown>) => {
    const removeBlogger = api.admin.blogger.removeBlogger.useMutation()
    const utils = api.useUtils()

    return <ActionsDropdown>
        <ActionItem>
            <Link href={`/moder/moderation/bloggers/${row.original.id}`} className="flex items-center gap-x-2">
                <Eye size={18} />
                <Translate namespace="Blogger" itemKey="watch" />
            </Link>
        </ActionItem>
    </ActionsDropdown>
}

type TableData = Prisma.BloggerGetPayload<{
    include: {
        User: {
            select: {
                email: true
            }
        }
    }
}> & Blogger

export const columns: ColumnDef<TableData>[] = [
    {
        accessorFn: (row) => {
            return row.User.email
        },
        header: "Email",
    },

    {
        accessorKey: "username",
        header: "Назва каналу",
    },
    {
        accessorKey: "type",
        header: "Соц мережа",
    },
    {
        header: 'Категорії',
        cell: ({ row }) => {
            const blogger = row.original;

            return !!blogger.categories.length ? <div className="inline-flex gap-1.5 flex-wrap w-[200px]">
                {blogger.categories.map(category => (
                    <p key={category}>
                        <Translate namespace="Categories" itemKey={category} />
                    </p>
                ))}
            </div> : 'Без категорії'
        }
    },
    {
        header: 'Теги',
        cell: ({ row }) => {
            const blogger = row.original;

            if (!blogger.tags.length) return 'Без тега'

            return <div className="flex flex-wrap gap-2">
                {blogger.tags.map(tag => (
                    <BloggerTagBadge key={tag} tag={tag} />
                ))}
            </div>
        }
    },
    {
        header: 'Статус',
        cell: ({ row }) => {
            const blogger = row.original;

            return <BloggerStatusBadge status={blogger.status} />
        }
    },
    {
        header: "Модерація",
        cell: ({ row }) => <StatusModerationCell blogger={row.original} />
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];

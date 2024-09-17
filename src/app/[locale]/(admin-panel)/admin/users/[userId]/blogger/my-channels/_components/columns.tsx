'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/navigation";
import { type Blogger } from "@prisma/client";
import Translate from "@/components/Translate";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import BloggerStatusBadge from "@/components/ui/custom/badges/statuses/blogger";
import { Eye, Pencil } from "lucide-react";

const ActionsCell = ({ row }: CellContext<Blogger, unknown>) => {
    const blogger = row.original;

    return <ActionsDropdown>
        <ActionItem className="">
            <Link href={`my-channels/${blogger.id}`} className="flex items-center gap-x-2">
                <Eye size={17} />
                <Translate namespace="Blogger" itemKey="watch" />
            </Link>
        </ActionItem>
    </ActionsDropdown>
}

export const columns: ColumnDef<Blogger>[] = [
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
        accessorKey: 'username',
        header: () => {
            return <Translate namespace="Blogger" itemKey="channel" />
        }
    },
    {
        id: "social",
        header: () => {
            return <Translate namespace="Blogger" itemKey="socnetwork" />
        },
        cell: ({ row }) => (
            <Translate namespace="Socials" itemKey={row.original.type} />
        )
    },
    {
        accessorKey: "status",
        header: () => <Translate namespace="Blogger" itemKey="status"/>,
        cell: ({ row }) => {
            const blogger = row.original;

            return <BloggerStatusBadge status={blogger.status} />;
        }
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];


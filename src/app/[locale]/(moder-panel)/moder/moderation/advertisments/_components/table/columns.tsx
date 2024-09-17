
'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type AdvertismentPost } from "@prisma/client";
import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import AdvertismentPostStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-post";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { Eye } from "lucide-react";
import ModerationButtons from "../moderation-cell/moderate-buttons";



const ActionsCell = ({ row }: CellContext<AdvertismentPost, unknown>) => {
    return <ActionsDropdown>
        <ActionItem>
            <Link href={`/admin/moderation/advertisments/${row.original.id}`} className="flex items-center gap-x-2">
                <Eye size={18} />
                <Translate namespace="Blogger" itemKey="watch" />
            </Link>
        </ActionItem>
    </ActionsDropdown>
}

export const columns: ColumnDef<AdvertismentPost>[] = [
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
        accessorKey: "title",
        header: "Назва Посту",
    },
    {
        header: "СОЦ. МЕРЕЖА",
        cell: ({ row }) => (
            <Translate namespace="Socials" itemKey={row.original.social} />
        )
    },
    {
        header: "Тип посту",
        cell: ({ row }) => {
            const advertisment = row.original;

            return advertisment.initialType
                ? <Translate namespace="Post-Types" itemKey={advertisment.initialType} />
                : <Translate namespace="Post-Types" itemKey='empty' />
        },
    },
    {
        header: "Модерація",
        cell: ({ row }) => {
            const advertisment = row.original;

            if (advertisment.status !== 'Moderating') {
                return <AdvertismentPostStatusBadge status={advertisment.status} />;
            }

            return (
                <ModerationButtons advertisment={advertisment} />
            )
        }
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];


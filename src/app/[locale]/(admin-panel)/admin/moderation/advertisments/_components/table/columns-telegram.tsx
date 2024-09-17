
'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type AdvertismentPost } from "@prisma/client";
import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import AdvertismentPostStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-post";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { Eye, Trash2 } from "lucide-react";
import ModerationButtons from "../moderation-cell/moderate-buttons";
import { api } from '@/trpc/react'


const ActionsCell = ({ row }: CellContext<AdvertismentPost, unknown>) => 
{
    const removePost = api.admin.advertisment.removePost.useMutation()
    const utils = api.useUtils()
    const [open, setOpen] = useState(false);
    
    return ( <ActionsDropdown open={open} setOpen={setOpen}>
        <ActionItem>
            <Link href={`/admin/moderation/advertisments/${row.original.id}`} className="flex items-center gap-x-2">
                <Eye size={18}  />
                <Translate namespace="Blogger" itemKey="watch" />
            </Link>
        </ActionItem>
        <ActionItem>
            <div className="flex items-center gap-x-2" onClick=
                {
                    () => 
                    {
                        removePost.mutate({postId: row.original.id})
                        utils.admin.advertisment.getModerationAdvertisments.setData(undefined, (prevData) => 
                        {
                            return prevData?.filter(post => post.id != row.original.id)
                        })
                        setOpen(false)
                    }
                }>
                <Trash2 size={18}  />
                Видалити
            </div>
        </ActionItem>
    </ActionsDropdown>
    )
}

export const columnsTelegram: ColumnDef<AdvertismentPost>[] = [
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
        header: "Модерація",
        cell: ({ row }) => {
            const advertisment = row.original;

            if (advertisment.status !== 'Moderating') {
                return <AdvertismentPostStatusBadge status={advertisment.status} />;
            }

            return (
                <ModerationButtons advertisment={advertisment} userId={advertisment.creatorId} />
            )
        }
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];


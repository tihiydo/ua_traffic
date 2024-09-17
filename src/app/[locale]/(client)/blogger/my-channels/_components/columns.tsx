'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/navigation";
import { type Blogger } from "@prisma/client";
import Translate from "@/components/Translate";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import BloggerStatusBadge from "@/components/ui/custom/badges/statuses/blogger";
import { Eye, Pencil, Trash2Icon } from "lucide-react";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import { routes } from "@/routes";
import { Button } from "@/components/ui/button";
import SocialIcon from "@/components/ui/social-icon";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import translateError from "@/components/translate-error";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { utimesSync } from "fs";
import AskAction from "@/components/ui/custom/ask-action";


const ActionsCell = ({ row }: CellContext<Blogger, unknown>) => 
{
    const utils = api.useUtils();

    const { mutateAsync, isLoading } = api.blogger.deleteBlogger.useMutation
    ({
        onSuccess: (id) => 
        {
            utils.blogger.getAllMyChannels.setData(undefined, (bloggers) =>
            {
                if(bloggers !== undefined)
                {
                    return bloggers.filter((blogger) => blogger.id !== id)
                }
            })
            toast.success("Канал видалено")
        }
    });
    const blogger = row.original;

    return <div className="flex justify-center">
        <ActionsDropdown>
            { blogger.status != "Moderating" &&
                <ActionItem className="">
                    <Link href={`/catalog/${blogger.id}`} className="flex items-center gap-x-2">
                        <Eye size={17} />
                        <Translate namespace="Blogger" itemKey="watch" />
                    </Link>
                </ActionItem>
            }

            <ActionItem className="text-left">
                <Link href={`/blogger/my-channels/${blogger.id}`} className="flex items-center gap-x-2">
                    <Pencil size={17} />
                    <Translate namespace="Blogger" itemKey="edit" />
                </Link>
            </ActionItem>

            <ActionItem className="text-left">
                <AskAction onAccept={async () =>
                {
                    const request = await mutateAsync({bloggerId: blogger.id})
                }}>
                <div className="w-full">
                    <div className="flex items-center gap-x-2">
                        <Trash2Icon size={17} />
                        <Translate namespace="Blogger" itemKey="delete-blogger" />
                    </div>
                </div>
                </AskAction>
                
            </ActionItem>
        </ActionsDropdown>
    </div>
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
        id: 'blogger-avatar',
        cell: ({ row }) => {
            const blogger = row.original;

            return <Link href={blogger.profileLink !== null ? blogger.profileLink : `${routes.catalog.link}/${blogger.id}`} target="_blank" className="flex justify-center">
                <BloggerAvatar src={blogger.profilePicture} className="w-12 h-12" />
            </Link>
        }
    },
    {
        id: 'username',
        accessorFn: (row) => row.username,
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="channel" />
            </p>
        },
        cell: ({ row }) => {
            const blogger = row.original;
            return <Link href={blogger.profileLink !== null ? blogger.profileLink : `${routes.catalog.link}/${blogger.id}`} target="_blank" className="flex justify-center">
                <Button variant={'link'} className="hover:text-yellow transition-colors">
                    {blogger.username}
                </Button>
            </Link>
        },
    },
    {
        header: () => {
            return <p className="text-center">
                <Translate namespace="Default" itemKey="channel-type" />
            </p>
        },
        id: "blogger-social",
        cell: ({ row }) => {
            const blogger = row.original;

            return <div className="flex  justify-center">
                <SocialIcon className="w-8 h-8" social={blogger.type} />
            </div>
        },
    },
    {
        accessorKey: "status",
        header: () => (
            <p className="text-center">
                <Translate namespace="Blogger" itemKey="status" />
            </p>
        ),
        cell: ({ row }) => {
            const blogger = row.original;

            return <div className="flex justify-center">
                <BloggerStatusBadge status={blogger.status} />
            </div>
        }
    },
    {
        id: 'actions',
        header: () => (<p className="text-center">
            <Translate namespace="Default" itemKey="actions" />
        </p>),
        cell: ActionsCell
    }
];
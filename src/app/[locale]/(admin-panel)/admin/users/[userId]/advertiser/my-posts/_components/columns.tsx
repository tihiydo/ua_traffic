'use client'

import { Checkbox } from "@radix-ui/react-checkbox";
import { type CellContext, type ColumnDef } from "@tanstack/react-table";
import type { AdvertismentPost } from "@prisma/client";
import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { api } from "@/trpc/react";
import AdvetismentPostStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-post";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { Eye, Trash2 } from "lucide-react";
import { useErrorTranslate } from "@/hooks/use-error";
import { toast } from "react-toastify";

const ActionsCell = ({ row }: CellContext<AdvertismentPost, unknown>) => {
    const advertismentPost = row.original;
    const utils = api.useUtils();
    const translateError = useErrorTranslate();
    const { mutate: deleteAdvertisment, isLoading: isDeleting } = api.advertisment.posts.deletePost.useMutation({
        onSuccess: () => {
            utils.advertisment.posts.getMyPosts.setData(undefined, (prev) => {

                return prev?.filter(post => post.id !== advertismentPost.id)
            })
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    return <ActionsDropdown>
        <ActionItem>
            <Link href={`my-posts/${advertismentPost.id}`} className="flex items-center gap-x-2">
                <Eye size={17} />
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
        header: () => {
            return <Translate namespace='Advertiser' itemKey="postname" />
        }
    },
    {
        id: "social",
        header: () => {
            return <Translate namespace='Advertiser' itemKey="socnetwork" />
        },
        cell: ({ row }) => (
            <Translate namespace="Socials" itemKey={row.original.social} />
        )
    },
    {
        accessorKey: "posttype",
        cell: ({ row }) => {
            const advertisment = row.original;

            return advertisment.initialType
                ? <Translate namespace="Post-Types" itemKey={advertisment.initialType} />
                : <Translate namespace="Post-Types" itemKey='empty' />
        },
        header: () => {
            return <Translate namespace="Advertiser" itemKey="typepost" />
        },
    },
    {
        accessorKey: "status",
        header: () => {
            return <Translate namespace="Advertiser" itemKey="status" />
        },
        cell: ({ row }) => {
            const advertisment = row.original;

            return <AdvetismentPostStatusBadge status={advertisment.status} />
        }
    },

    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell,
    },
];



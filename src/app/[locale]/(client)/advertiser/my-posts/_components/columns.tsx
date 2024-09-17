'use client'

import { type CellContext, type ColumnDef } from "@tanstack/react-table";
import type { AdvertismentPost } from "@prisma/client";
import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { api } from "@/trpc/react";
import AdvetismentPostStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-post";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { Eye, MinusIcon, Trash2 } from "lucide-react";
import { useErrorTranslate } from "@/hooks/use-error";
import { toast } from "react-toastify";
import SocialIcon from "@/components/ui/social-icon";
import { Checkbox } from "@/components/ui/checkbox";
import AskAction from "@/components/ui/custom/ask-action";

const ActionsCell = ({ row }: CellContext<AdvertismentPost, unknown>) => {
    const advertismentPost = row.original;
    const utils = api.useUtils();
    const translateError = useErrorTranslate();
    const { mutateAsync: deleteAdvertisment, isLoading: isDeleting } = api.advertisment.posts.deletePost.useMutation({
        onSuccess: () => {
            utils.advertisment.posts.getMyPosts.setData(undefined, (prev) => {

                return prev?.filter(post => post.id !== advertismentPost.id)
            })
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    return <div className="flex justify-center">
        <ActionsDropdown>
            <ActionItem>
                <Link href={`/advertiser/my-posts/${advertismentPost.id}`} className="flex items-center gap-x-2">
                    <Eye size={17} />
                    <Translate namespace="Blogger" itemKey="watch" />
                </Link>
            </ActionItem>
            <ActionItem
                className="flex items-center gap-2"
                disabled={isDeleting}>
                
                <AskAction onAccept={async () => 
                {
                    await deleteAdvertisment({ id: advertismentPost.id })
                }}>
                {
                isDeleting ? <SpinnerLoading className="text-gray-secondary" /> : <span className="flex items-center gap-x-2">
                    <Trash2 size={16} />
                    <Translate namespace="Default" itemKey="delete" />
                </span>
                }
                </AskAction>
            </ActionItem>
        </ActionsDropdown>
    </div>

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
        id: "post-social",
        cell: ({ row }) => {
            const advertisment = row.original;

            return <div className="flex justify-center">
                <SocialIcon className="w-7 h-7" social={advertisment.social} />
            </div>
        },
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="socnetwork" />
            </p>
        },
    },
    {
        accessorKey: "post-type",
        cell: ({ row }) => {
            const advertisment = row.original;
            if (advertisment.initialType) {
                return <div className="flex gap-2 items-center justify-center font-medium">
                    <Translate namespace="Post-Types" itemKey={advertisment.initialType} />
                </div>
            }

            return <div className="flex justify-center">
                <MinusIcon />
            </div>
        },
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="typepost" />
            </p>
        },
    },
    {
        accessorKey: "status",
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="status" />
            </p>
        },
        cell: ({ row }) => {
            const advertisment = row.original;

            return <div className="flex justify-center">
                <AdvetismentPostStatusBadge status={advertisment.status} />
            </div>
        }
    },

    {
        id: 'actions',
        header: () => <p className="text-center">
            <Translate namespace="Default" itemKey="actions" />
        </p>,
        cell: ActionsCell,
    },
];



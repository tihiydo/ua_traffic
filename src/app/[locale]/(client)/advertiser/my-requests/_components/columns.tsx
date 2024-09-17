'use client'

import Translate from "@/components/Translate";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import DateFormat from "@/components/date-format";
import DateRange from "@/components/date-range";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AdvertismentRequestStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-request";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import SocialIcon from "@/components/ui/social-icon";
import { Link, useRouter } from "@/i18n/navigation";
import { routes } from "@/routes";
import { type Prisma } from "@prisma/client";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Eye, MessageCircleIcon, MinusIcon } from "lucide-react";
import CreateChatButton from "./create-chat-button";
import ReviewModal from './reviewModal';
import { type FC } from 'react';

type TableData = Prisma.AdvertismentRequestGetPayload<{ include: { Blogger: true, AdvertismentPost: true, Chat: true, review: true } }>;

const YellowDot: FC = () => (
    <span className="w-2 h-2 bg-yellow rounded-full absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2"></span>
);

const ActionsCell = ({ row }: CellContext<TableData, unknown>) => {
    const showReviewDot = row.original.status === 'Done' && !row.original.review;

    return (
        <div className="flex items-center justify-end">
            <div className="relative">
                {showReviewDot && <YellowDot />}
                <ActionsDropdown>
                    <ActionItem>
                        <Link href={`/advertiser/my-requests/${row.original.id}`} className="flex items-center gap-x-2">
                            <Eye size={18} />
                            <Translate namespace="Blogger" itemKey="watch" />
                        </Link>
                    </ActionItem>
                    {row.original.status === 'Done' && !row.original.review &&
                        <ActionItem>
                            <ReviewModal 
                                bloggerId={row.original.Blogger.id} 
                                requestId={row.original.id}
                            />
                        </ActionItem>
                    }
                </ActionsDropdown>
            </div>
        </div>
    );
};

const ChatCell = ({ row }: CellContext<TableData, unknown>) => {
    const { status, Chat: chat, id } = row.original;
    const router = useRouter();

    if (status === 'Accepted' || status === 'Moderating') {
        if (!chat) {
            return <CreateChatButton
                requestId={id}
                onSuccess={(chat) => router.push(`/advertiser/chats?chat=${chat.id}`)}
            />
        }

        return <Button asChild>
            <Link href={`/advertiser/chats?chat=${chat.id}`} >
                <MessageCircleIcon />
            </Link>
        </Button>
    }

    return <MinusIcon className="opacity-75" />
}

export const columns: ColumnDef<TableData>[] = [
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
            const blogger = row.original.Blogger;

            return <Link href={blogger.profileLink ?? `${routes.catalog.link}/${blogger.id}`} target="_blank" className="flex justify-center">
                <BloggerAvatar src={blogger.profilePicture} className="w-12 h-12" />
            </Link>
        }
    },
    {
        id: 'username',
        accessorFn: ({ Blogger: { username }}) => username,
        cell: ({ row }) => {
            const blogger = row.original.Blogger;
            return <Link href={blogger.profileLink ?? `${routes.catalog.link}/${blogger.id}`} target="_blank" className="flex justify-center">
                <Button variant={'link'} className="hover:text-yellow transition-colors">
                    {blogger.username}
                </Button>
            </Link>
        },
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="channel" />
            </p>
        }

    },
    {
        id: 'Назва',
        header: () => {
            return <p className="text-center">
                <Translate namespace='Advertiser' itemKey="postname" />
            </p>
        },
        cell: ({ row }) => (
            <p className="text-center">
                {row.original.AdvertismentPost.title}
            </p>
        )
    },
    {
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="typepost" />
            </p>
        },
        accessorKey: "posttype",
        cell: ({ row }) => {
            const advertismentReq = row.original;

            return <div className="flex gap-2 items-center justify-center">
                <SocialIcon className="w-7 h-7" social={advertismentReq.AdvertismentPost.social} />

                <Translate namespace="Post-Types" itemKey={advertismentReq.type} />
            </div>
        },
    },
    {
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="publishdate" />
            </p>
        },
        accessorKey: "date",
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
        header: () => {
            return (
                <p className="text-center">
                    <Translate namespace="Advertiser" itemKey="price" />
                </p>
            );
        },

        cell: ({ row }) => {
            const advertismentRequest = row.original;

            return <p className="text-center">
                {advertismentRequest.price}

                <span className="font-bold ml-0.5">₴</span>
            </p>
        }
    },
    {
        accessorKey: "status",
        header: () => {
            return <p className="text-center">
                <Translate namespace="Advertiser" itemKey="status" />
            </p>
        },
        cell: ({ row }) => {
            const status = row.original.status;
    
            return <div className="flex justify-center">
                <AdvertismentRequestStatusBadge status={status} />
            </div>
        },
    },
    {
        id: 'chat',
        header: () => <Translate namespace="Chat" itemKey="chat" />,
        cell: ChatCell
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    },
];



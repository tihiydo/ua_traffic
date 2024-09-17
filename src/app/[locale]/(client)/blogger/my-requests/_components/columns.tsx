'use client'

import { Button } from "@/components/ui/button";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { ClockIcon, Eye, MessageCircleIcon, MinusIcon } from "lucide-react";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type Prisma } from "@prisma/client";
import Translate from "@/components/Translate";
import AcceptDeclineButtons from "./actions-cell/accept-decline-buttons";
import DoneButton from "./actions-cell/done-button";
import DateRange from "@/components/date-range";
import { Link, useRouter } from "@/i18n/navigation";
import DateFormat from "@/components/date-format";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import AdvertismentRequestStatusBadge from "@/components/ui/custom/badges/statuses/advertisment-request";
import { isAfter } from "date-fns";
import CreateChatButton from "../../../advertiser/my-requests/_components/create-chat-button";
import SocialIcon from "@/components/ui/social-icon";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import { routes } from "@/routes";


export type TableData = Prisma.AdvertismentRequestGetPayload<{ include: { Blogger: true, AdvertismentPost: true, Chat: true } }>;

const ActionsCell = ({ row }: CellContext<TableData, unknown>) => {
    return <ActionsDropdown>
        <ActionItem>
            <Link href={`/blogger/my-requests/${row.original.id}`} className="flex items-center gap-x-2">
                <Eye size={18} />
                <Translate namespace="Blogger" itemKey="watch" />
            </Link>
        </ActionItem>
    </ActionsDropdown>
}

const ChatCell = ({ row }: CellContext<TableData, unknown>) => {
    const { status, Chat: chat, id } = row.original;
    const router = useRouter();

    if (status === 'Accepted' || status === 'Moderating') {
        if (!chat) {
            return <CreateChatButton
                requestId={id}
                onSuccess={(chat) => router.push(`/blogger/chats?chat=${chat.id}`)}
            />
        }

        return <Button asChild>
            <Link href={`/blogger/chats?chat=${chat.id}`} >
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
        cell: ({ row }) => {
            const blogger = row.original.Blogger;
            return <Link href={blogger.profileLink ?? `${routes.catalog.link}/${blogger.id}`} target="_blank" className="flex justify-center">
                <Button variant={'link'} className="hover:text-yellow transition-colors">
                    {blogger.username}
                </Button>
            </Link>
        },
        accessorFn: (row) => row.Blogger.username,
        id: 'username',
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="channel" />
            </p>
        }
    },
    {
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="typepost" />
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
                <Translate namespace="Blogger" itemKey="publishdate" />
            </p>
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
        header: () => {
            return (
                <p className="text-center">
                    <Translate namespace="Blogger" itemKey="price" />
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
        header: () => {
            return <p className="text-center">
                <Translate namespace="Blogger" itemKey="status" />
            </p>
        },
        accessorKey: "status",
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
        id: "accept",
        // header: () => {
        //     return <Translate namespace="Blogger" itemKey="acceptor" />
        // },
        cell: ({ row }) => {
            const advertismentRequest = row.original;
            if (advertismentRequest.status === 'New') {
                return (
                    <div className="flex justify-center">
                        <AcceptDeclineButtons advertismentRequest={advertismentRequest} />
                    </div>
                )
            }

            if (advertismentRequest.status === 'Accepted') {
                if (!advertismentRequest.exactDate) return 'Точна дата не вибрана';

                if (isAfter(new Date(), advertismentRequest.exactDate)) {
                    return <DoneButton
                        advertismentRequestId={advertismentRequest.id}
                        advertismentPostId={advertismentRequest.advertismentPostId}
                    />
                } else {
                    return <div className="flex gap-1.5 items-center">
                        <ClockIcon /> <DateFormat date={advertismentRequest.exactDate} />
                    </div>
                }
            }
        }
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];

'use client'

import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { type User } from "@prisma/client";
import UserStatusBadge from "@/components/ui/custom/badges/statuses/user";
import BanButton from "./simply-button/ban";
import { Link } from "@/i18n/navigation";
import { Eye, Trash2Icon } from "lucide-react";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import Translate from "@/components/Translate";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "react-toastify";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import AskAction from "@/components/ui/custom/ask-action";


const ActionsCell = ({ row }: CellContext<User, unknown>) => {
    const utils = api.useUtils();
    const [open, setOpen] = useState(false);
    const deleteUserMutation = api.admin.users.deleteUser.useMutation({
        onSuccess: (email) => {
            toast.success(`Користувача ${email} видалено`, { autoClose: false })
            utils.admin.users.getUsers.invalidate();
            setOpen(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return <ActionsDropdown open={open} setOpen={setOpen}>
        <ActionItem>
            <Link href={`/admin/users/${row.original.id}`} className="flex items-center gap-x-2">
                <Eye size={18} />
                Дивитися
            </Link>
        </ActionItem>

        { row.original.id !== "MODER" &&
                <ActionItem
                    disabled={deleteUserMutation.isLoading}
                >
                    <AskAction onAccept={async () => 
                    {
                        await deleteUserMutation.mutateAsync({ id: row.original.id })
                    }}>
                        <div className="w-full">
                            <div className="flex items-center gap-x-2">
                                {deleteUserMutation.isLoading ? (
                                    <SpinnerLoading className="mx-auto" />
                                ) : (
                                    <>
                                        <Trash2Icon size={18} />
                                        Видалити
                                    </>
                                )}
                            </div>
                        </div>
                    </AskAction>
                </ActionItem>
        }
    </ActionsDropdown >
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },

    {
        accessorKey: "name",
        header: "Ім'я",
        cell: ({ row }) => {
            const user = row.original;
            return user.name ? user.name : 'Невідомо'
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        header: 'Телефон',
        cell: ({ row }) => {
            const user = row.original;
            return user.tel ? user.tel : 'Номер відсутний'
        }
    },
    {
        header: 'Статус',
        cell: ({ row }) => {
            const user = row.original;

            return <UserStatusBadge status={user.banned} />
        }
    },
    {
        header: "Модерація",
        cell: ({ row }) => {
            const user = row.original;
            if(user.id !== "MODER")
            {
                return <BanButton user={user} /> 
            } 
        }
    },
    {
        id: 'actions',
        header: () => <Translate namespace="Default" itemKey="actions" />,
        cell: ActionsCell
    }
];

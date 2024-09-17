import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Translate from "@/components/Translate";
import StatusBadge from "@/app/[locale]/(client)/advertiser/_components/statusBadge";

export type Advertisment = {
  id: string;
  channel: string;
  socialNetwork: string;
  type: string;
  postingTime: string;
  price: number;
  status: AdvertismentStatus;
  preview?: string
  acceptOrUnaccept?: string;
};

export type AdvertismentStatus =
  | "success"
  | "cancelled"
  | "new"
  | "accepted"
  | "return";

export const advertisments: Advertisment[] = [
    {
        id: "1",
        channel: "Труха",
        postingTime: `25.09.2023 - 29.09.2023   
        З 15:30 по 17:30`,
        price: 3700,
        socialNetwork: "TELEGRAM",
        type: "СторІ ТЗ",
        status: "success",
    },
    {
        id: "2",
        channel: "Труха",
        postingTime: `25.09.2023 - 29.09.2023   
        З 15:30 по 17:30`,
        price: 3200,
        socialNetwork: "TELEGRAM",
        type: "СторІ ТЗ",
        status: "success",
    },
];

export const columns: ColumnDef<Advertisment>[] = [
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
        accessorKey: "channel",
        header: "Channel",
    },
    {
        accessorKey: "socialNetwork",
        header: "Соц мережа",
    },
    {
        accessorKey: "type",
        header: "ТИП ПОСТУ",
    },
    {
        accessorKey: "postingTime",
        header: "Час розміщення",
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
          ЦІНА ПОСТА 
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const value = getValue() as string;

            return <div className="ml-2">{value} ₴</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <Translate namespace="Blogger" itemKey="status"/>,
        cell: ({ getValue }) => {
            const status = getValue() as AdvertismentStatus;

            return <StatusBadge status={status} />;
        },
    },
    {
        accessorKey: "preview",
        header: "Перегляд",
        cell: () => 
        {
            return (
                <>
                    <ins className="cursor-pointer">ДИВИТИСЯ</ins>
                </>
            )
        },
    },
    {
        accessorKey: "acceptOrUnaccept",
        header: "Прийняти/Відхилити",
        cell: () => 
        {
            return (
                <>
                    <div className="flex">
                        <Button className="font-bold mx-1" variant={"success"}>Прийняти</Button>
                        <Button className="font-bold mx-1" variant={"cancel"}>Відхилити</Button>
                    </div>
                </>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
              Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

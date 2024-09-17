"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Button, type ButtonProps } from "./ui/button";
import { Children, type SetStateAction, useState } from "react";


type ActionsDropdownProps = {
    children: React.ReactNode
    open?: boolean;
    setOpen?: React.Dispatch<SetStateAction<boolean>>;
    classNames?: Partial<{
        content: string;
    }>
}

const ActionsDropdown = ({ children, open, setOpen, classNames }: ActionsDropdownProps) => {
    const [innerOpen, innerSetOpen] = useState(false);



    return (
        <DropdownMenu open={open != null ? open : innerOpen} onOpenChange={(isOpen) => {
            innerSetOpen(isOpen);

            if (setOpen) {
                return setOpen(isOpen)
            }
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={classNames?.content}>
                {Children.map(children, ((child, index) => (
                    <DropdownMenuItem
                        asChild
                        key={index}
                    >
                        {child}
                    </DropdownMenuItem>
                )))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import React from 'react'
import { twMerge } from "tailwind-merge";

type AcitonProps = Omit<ButtonProps, 'variant'>;

const ActionItem = ({ className, ...props }: AcitonProps) => {
    return (
        <Button
            className={twMerge('w-full !cursor-pointer justify-normal', className)}
            variant={'menu-item'}
            {...props}
        />
    )
}

export { ActionItem };


export default ActionsDropdown
'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
type Props = {
    trigger?: React.ReactNode;
    children?: React.ReactNode;
    hover?: boolean;
}

const TouchHoverPopover = ({ children, trigger, hover = true }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger
                className="cursor-pointer"
                asChild
                type="button"
                onMouseEnter={() => {
                    if (!hover) return
                    
                    setTimeout(() => {
                        setOpen(true)
                    }, 500)
                }}
                onMouseLeave={() => {
                    if (!hover) return
                    setTimeout(() => {
                        setOpen(false)
                    }, 300)
                }}
            >

                {trigger ?? 'open'}
            </PopoverTrigger>
            <PopoverContent className="p-2 text-xs w-fit">
                {children}
            </PopoverContent>
        </Popover>
    )
}

export default TouchHoverPopover
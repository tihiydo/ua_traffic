'use client'

import React from "react"
import { Tabs } from "../tabs"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"


export const CustomTabs = Tabs

export const CustomTabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "justify-start flex overflow-x-auto items-center rounded-md p-1 gap-3",
            className
        )}
        {...props}
    />
))
CustomTabsList.displayName = TabsPrimitive.List.displayName


export const CustomTabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "relative flex  gap-2 items-center font-title uppercase justify-center whitespace-nowrap rounded-sm p-0 text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50    px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] data-[state=active]:after:w-full",
            className
        )}
        {...props}
    />
))
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export const CustomTabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
            className
        )}
        {...props}
    />
))
CustomTabsContent.displayName = TabsPrimitive.Content.displayName
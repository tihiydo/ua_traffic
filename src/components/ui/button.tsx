import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary font-bold text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive font-bold text-white hover:bg-destructive/90",
                outline:
                    "border font-bold border-gray-secondary bg-white hover:bg-gray hover:text-accent-foreground",
                'accent-outline':
                    "border font-medium text-yellow border-yellow bg-white hover:bg-gray",
                success:
                    "bg-[#cbffb8] hover:bg-[#cbffb899] hover:text-accent-foreground",
                cancel:
                    "bg-[#ffb8b8] hover:bg-[#ffb8b899] hover:text-accent-foreground",
                secondary:
                    "bg-gray-secondary/25 font-bold hover:bg-gray-secondary/40",
                ghost: "hover:bg-gray",
                link: "text-main hover:underline justify-start !p-0 !w-fit !h-fit",
                'menu-item': 'bg-opacity-0 text-current py-1 px-2 !h-fit hover:!ring-0 text-sm'
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }), '')}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }

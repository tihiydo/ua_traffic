'use client'

import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePrevious } from "@/hooks/use-previous";

const infoMessageVariants = cva(
    "flex items-center justify-between border-2 w-full max-w-[450px]",
    {
        variants: {
            variant: {
                default: 'border-gray-secondary border-opacity-40 bg-gray-secondary/20 bg-opacity-30 text-main text-opacity-50',
                error: 'border-destructive border-opacity-40 bg-red bg-opacity-30 text-destructive',
                warning: 'border-warning text-warning bg-warning bg-opacity-10 border-opacity-40',
                success: 'text-success border-success bg-success border-opacity-40 bg-opacity-20',
                info: "text-info border-info bg-info border-opacity-40 bg-opacity-20"
            },
            size: {
                default: 'gap-5 rounded-lg  sm:px-4 sm:py-3  sm:text-base text-sm px-3 py-2',
                sm: ' rounded-md sm:px-3 sm:py-2 sm:text-sm text-xs px-2 py-1'
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const closeButtonVariants = cva(
    "h-8 min-h-[2rem] w-8 min-w-[2rem] !bg-opacity-5 ",
    {
        variants: {
            variant: {
                default: 'hover:bg-main',
                error: 'hover:bg-destructive',
                warning: 'hover:bg-warning',
                success: 'hover:bg-success',
                info: 'hover:bg-info'
            },
            size: {
                default: '',
                sm: ''
            },
        },
    }
)


export type InfoMessageProps = {
    code?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    closable?: boolean;
    onClose?: () => void;
} & VariantProps<typeof infoMessageVariants>;

/**
 * 
 * @param props.code Key for InfoMessage to be shown after it has been closed
 * @returns 
 */
const InfoMessage = ({ children, className, onClose, closable, size, variant, icon, code }: InfoMessageProps) => {
    const [show, setShow] = useState(true);
    const prevCode = usePrevious(code);


    useEffect(() => {
        // Key is higher priority then children
        if (code) {
            if (prevCode === code) return;
            return setShow(true)
        }

        if (children) {
            return setShow(true)
        }
    }, [code, children, prevCode])

    if (!show) return null;

    const variantsIcons: Record<NonNullable<VariantProps<typeof infoMessageVariants>['variant']>, React.ReactNode> = {
        default: <InfoIcon className="min-w-fit" size={30} />,
        error: <InfoIcon className="min-w-fit" size={30} />,
        info: <InfoIcon className="min-w-fit" size={30} />,
        warning: <AlertTriangleIcon className="min-w-fit" size={30} />,
        success: <CheckCircle2Icon className="min-w-fit" size={30} />,
    }

    return (
        <div
            className={cn(infoMessageVariants({ variant, size, className }), '')}
        >
            <div className="flex items-center sm:gap-5 gap-3">
                {icon ? icon : variantsIcons[variant ?? 'error']}

                <div className="font-medium w-fit">{children}</div>
            </div>

            {closable && (
                <Button
                    type="button"
                    size="icon"
                    variant={"ghost"}
                    className={closeButtonVariants({ variant, size })}
                    onClick={() => {
                        setShow(false);
                        onClose?.();
                    }}
                >
                    <XIcon size={20} />
                </Button>
            )}

        </div>
    );
};

export default InfoMessage;

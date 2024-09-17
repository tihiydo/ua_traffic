"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogFooter
  }  from "../dialog"
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '../button'
import { twMerge } from 'tailwind-merge'
import SpinnerLoading from "./spinner-loading"

type Props = 
{
    children: React.ReactNode
    onAccept: () => Promise<void>
    text?: string
    className?: string
}

const AskAction = ({ children, className, text, onAccept }: Props) => 
{
    const t = useTranslations()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isOpen, setOpen] = useState<boolean>(false)

    const handleAccept = async () =>
    {
        setLoading(true)
        await onAccept()
        setLoading(false)
        setOpen(false)
    }

    return (
        <Dialog onOpenChange={setOpen} open={isOpen}>
            <DialogTrigger className="!p-0 !m-0">{children}</DialogTrigger>
            <DialogContent className="max-w-[420px] !gap-y-[1.6rem]">
                <div>
                    <h4 className='font-bold mb-1'>
                        {t("Default.deleteAsk")}
                    </h4>
                    <p className='text-sm font-medium text-main/70'>
                        {t("Default.deleteAskDescription")}
                    </p>
                </div>

                {
                    text 
                    && 
                    <div className="font-[500] text-[14px]">{t(text)}</div>
                }

                <DialogFooter className="!justify-end !flex-row">
                    <div className={twMerge("flex flex-row sm:gap-x-[30px] gap-x-[15px]", className)}>
                        <Button type="button" variant={"secondary"} className="w-[112px]" onClick={() => setOpen(false)}>{t("Default.decline")}</Button>
                        <Button type="button" variant={"destructive"} onClick={handleAccept} className="w-[112px]" disabled={isLoading}>
                            {
                                isLoading
                                ?
                                <SpinnerLoading/>
                                :
                                t("Default.delete")
                            }
                            
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AskAction
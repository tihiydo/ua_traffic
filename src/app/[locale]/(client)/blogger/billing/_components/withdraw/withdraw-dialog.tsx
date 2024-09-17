'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { useState } from 'react'
import WithdrawForm from './withdraw-form'
import { api } from '@/trpc/react'
import { toast } from 'react-toastify'
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import ServerErrorMessage from '@/components/server-error-message'
import { twMerge } from 'tailwind-merge'
import { useScreenSize } from '@/hooks/use-screen-size'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

type Props =
    {
        className?: string
    }

const WithdrawDialog = ({ className }: Props) => {
    const t = useTranslations("Blogger");
    const [open, setOpen] = useState(false);
    const utils = api.useUtils();
    const messageT = useTranslations('Messages')
    const [errorMessage, setErrorMessage] = useState<Maybe<string>>(null);
    const { isLoading, mutate } = api.withdrawTransaction.createTransaction.useMutation({
        onSuccess: (data) => {
            setOpen(false)
            utils.withdrawTransaction.getMyTransactions.setData(undefined, (prev) => {
                return [data, ...(prev ?? [])]
            })
            toast.success(messageT('withdraw-amount', { amount: data.amount }))
        },
        onError: (e) => {
            setErrorMessage(e.message)
        }
    });
    const { width } = useScreenSize();

    if (width >= 768) {
        return (
            <Dialog open={open} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setErrorMessage(null)
                }
                setOpen(isOpen)
            }}>
                <DialogTrigger asChild>
                    <Button className={twMerge("", className)}>
                        <Translate namespace='Blogger' itemKey='widthraw' />
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t("widthraw")}
                        </DialogTitle>
                    </DialogHeader>

                    <div>
                        {errorMessage && <ServerErrorMessage className='mb-5 w-full max-w-none' errorCode={errorMessage} />}

                        <WithdrawForm
                            close={() => setOpen(false)}
                            onSubmit={(data) => {
                                const intAmount = parseInt(data.amount);

                                mutate({ amount: intAmount, cardNumber: data.cardNumber })
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setErrorMessage(null)
            }
            setOpen(isOpen)
        }}>
            <DrawerTrigger asChild>
                <Button className={twMerge("", className)}>
                    <Translate namespace='Blogger' itemKey='widthraw' />
                </Button>
            </DrawerTrigger>

            <DrawerContent className='px-2 pb-2 '>
                <DrawerHeader>
                    <DrawerTitle className='text-center mb-5'>
                        {t("widthraw")}
                    </DrawerTitle>
                </DrawerHeader>

                <div className='max-w-[420px] mx-auto w-full'>
                    {errorMessage && <ServerErrorMessage className='mb-5 w-full max-w-none' errorCode={errorMessage} />}

                    <WithdrawForm
                        close={() => setOpen(false)}
                        onSubmit={(data) => {
                            const intAmount = parseInt(data.amount);

                            mutate({ amount: intAmount, cardNumber: data.cardNumber })
                        }}
                        isLoading={isLoading}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default WithdrawDialog
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


const WithdrawDialog = () => {
    const t = useTranslations("Blogger");
    const [open, setOpen] = useState(false);
    const utils = api.useUtils();
    const messageT = useTranslations('Messages')

    const { isLoading, mutate, error } = api.withdrawTransaction.createTransaction.useMutation({
        onSuccess: (data) => {

            setOpen(false)
            utils.withdrawTransaction.getMyTransactions.setData(undefined, (prev) => {
                return [data, ...(prev ?? [])]
            })
            toast.success(messageT('withdraw-amount', { amount: data.amount }))
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='sm:w-fit w-[100%]'>
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
                    {error?.message && <ServerErrorMessage className='mb-5' errorCode={error.message} />}

                    <WithdrawForm
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

export default WithdrawDialog
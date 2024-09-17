'use client'

import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import RequisitesForm from './requisites-form'
import { api } from '@/trpc/react'
import { useState } from 'react'
import Translate from '@/components/Translate'
import ServerErrorMessage from '@/components/server-error-message'
import { useScreenSize } from '@/hooks/use-screen-size'

const RequisitesDialog = () => {
    const [open, setOpen] = useState(false);
    const utils = api.useUtils();
    const { mutate: createRequisite, isLoading, error } = api.requisites.create.useMutation({
        onSuccess: (newRequisites) => {
            setOpen(false);
            utils.requisites.getMyRequisites.setData(undefined, (prev => {
                return [...(prev ?? []), newRequisites]
            }))
        }
    });
    const { width } = useScreenSize();

    if (width >= 768) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Translate namespace='Blogger' itemKey='addbillings' />
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Translate namespace='Blogger' itemKey='addingbilling' />
                        </DialogTitle>
                    </DialogHeader>

                    {!!error && (
                        <ServerErrorMessage errorCode={error.message} className='my-3' />
                    )}

                    <RequisitesForm
                        onSubmit={(data, card) => {
                            createRequisite({ card: data.card, fio: data.fio, cardBank: card })
                        }}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>
        )
    }


    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    <Translate namespace='Blogger' itemKey='addbillings' />
                </Button>
            </DrawerTrigger>

            <DrawerContent className='px-2 pb-2'>
                <DrawerHeader>
                    <DrawerTitle className='text-center mb-5'>
                        <Translate namespace='Blogger' itemKey='addingbilling' />
                    </DrawerTitle>
                </DrawerHeader>
                <div className='max-w-[420px] mx-auto w-full'>
                    {!!error && (
                        <ServerErrorMessage errorCode={error.message} className='my-3' />
                    )}

                    <RequisitesForm
                        onSubmit={(data, card) => {
                            createRequisite({ card: data.card, fio: data.fio, cardBank: card })
                        }}
                        isLoading={isLoading}
                    />
                </div>

            </DrawerContent>
        </Drawer>
    )
}

export default RequisitesDialog
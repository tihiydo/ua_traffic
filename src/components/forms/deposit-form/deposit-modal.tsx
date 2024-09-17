'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import DepositForm from './deposit-form'
import { api } from '@/trpc/react'
import { useRouter } from '@/i18n/navigation'
import Translate from '@/components/Translate'
import ServerErrorMessage from '@/components/server-error-message'
import { getWindow } from '@/utils/window'

type Props = {
    children?: React.ReactNode;
}

const DepositModal = ({ children }: Props) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { mutate: requestDeposit, error, isLoading } = api.depositTransaction.requestDeposit.useMutation({
        onSuccess: (data) => {
            setOpen(false);
            const window = getWindow()
            if(window)
            {
                window.open(data.pageUrl, '_blank', 'noopener,noreferrer');
            }

        }
    })

    return (
        <Dialog onOpenChange={setOpen} open={open} modal>
            <DialogTrigger asChild>
                <div>{ children }</div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Translate namespace='Advertiser' itemKey='addbalance' />
                    </DialogTitle>
                </DialogHeader>

                <div>
                    {!!error?.message && (
                        <ServerErrorMessage errorCode={error.message} className='mb-3' />
                    )}

                       
                    <DepositForm
                        isLoading={isLoading}
                        onSubmit={(data) => {
                            requestDeposit({
                                amount: parseFloat(data.amount)
                            });
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DepositModal
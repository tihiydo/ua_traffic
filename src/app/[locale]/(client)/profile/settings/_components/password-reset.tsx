'use client'

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { api } from '@/trpc/react'
import { type api as serverApi } from '@/trpc/server'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'
import ChangePasswordForm from './change-password-form'
import InfoMessage from '@/components/ui/custom/info-message'
import ServerErrorMessage from '@/components/server-error-message'
import Translate from '@/components/Translate'

type Props = {
    user: NonNullable<Awaited<ReturnType<typeof serverApi.user.getMyUser.query>>>
}

const PasswordReset = ({ user }: Props) => {
    const searchParams = useSearchParams();
    const token = searchParams.get('p-token')

    const sendEmailMutation = api.user.sendPasswordChangeEmail.useMutation({
        onSuccess: () => {
            toast.success('Лист надіслано')
        }
    });

    if (token) {
        return (
            <div >
                <InfoMessage className='my-2' variant={'warning'} size={'sm'}>
                    <Translate namespace='Profile' itemKey='password-change-warn' />
                </InfoMessage>

                <ChangePasswordForm token={token} />
            </div>
        )
    }

    return (
        <div>
            <p className='mb-2 text-sm'>
                <Translate namespace='Profile' itemKey='passwordchangedesc'/> {user.email}
            </p>

            {!!sendEmailMutation.error?.message && (
                <ServerErrorMessage errorCode={sendEmailMutation.error?.message} className='my-3' />
            )}

            <Button
                disabled={sendEmailMutation.isLoading || sendEmailMutation.isSuccess}
                onClick={() => {
                    sendEmailMutation.mutate();
                }}
            >
                {sendEmailMutation.isLoading && <SpinnerLoading className='mr-2' />}
                <Translate namespace='Profile' itemKey='sendemail'/>
            </Button>
        </div>
    )
}

export default PasswordReset
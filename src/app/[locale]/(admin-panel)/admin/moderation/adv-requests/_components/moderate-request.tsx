'use client'

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { useRouter } from '@/i18n/navigation'
import { api } from '@/trpc/react'
import React from 'react'

type Props = {
    requestId: string
}

const ModerateRequestButton = ({ requestId }: Props) => {
    const router = useRouter();
    const { mutate: moderateRequest, isLoading } = api.admin.advertisment.moderateRequest.useMutation({
        onSuccess: () => {
            router.refresh()
        }
    })

    return (
        <Button
            disabled={isLoading}
            onClick={() => {
                moderateRequest({ requestId })
            }}
            className='font-bold'
            variant={'success'}
        >
            {isLoading && <SpinnerLoading className='mr-2' />}
            Підтвердити
        </Button>
    )
}

export default ModerateRequestButton
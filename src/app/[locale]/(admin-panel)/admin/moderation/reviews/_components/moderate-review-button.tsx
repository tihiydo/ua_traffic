'use client'

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { useRouter } from '@/i18n/navigation'
import { api } from '@/trpc/react'
import React from 'react'

type Props = {
    reviewId: string
}

const ModerateReviewButton = ({ reviewId }: Props) => {
    const router = useRouter();
    const { mutate: moderateReview, isLoading } = api.admin.reviews.moderateReview.useMutation({
        onSuccess: () => {
            router.refresh()
        }
    })

    return (
        <div className='flex gap-3'>
            <Button
                disabled={isLoading}
                onClick={() => {
                    moderateReview({ reviewId, action: 'approve' })
                }}
                className='font-bold'
                variant={'success'}
            >
                {isLoading && <SpinnerLoading className='mr-2' />}
            Прийняти
            </Button>
            <Button
                disabled={isLoading}
                onClick={() => {
                    moderateReview({ reviewId, action: 'reject' })
                }}
                className='font-bold'
                variant={'cancel'}
            >
                {isLoading && <SpinnerLoading className='mr-2' />}
            Відхилити
            </Button>
        </div>
        
    )
}

export default ModerateReviewButton
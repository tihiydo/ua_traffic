'use client'

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { api } from '@/trpc/react'
import { type Blogger } from '@/database/blogger'
import React from 'react'
import { useUpdateBlogger } from './use-update-blogger'

type Props = {
    blogger: Blogger
}

const DisactivateBloggerButton = ({ blogger }: Props) => {
    const updateBlogger = useUpdateBlogger();
    const toggleBloggerStatus = api.admin.blogger.toggleBloggerStatus.useMutation({
        onSuccess: (blogger) => {
            updateBlogger(blogger)
        }
    });
    return (
        <Button
            disabled={toggleBloggerStatus.isLoading}
            onClick={() => {
                toggleBloggerStatus.mutate({
                    bloggerId: blogger.id,
                    newStatus: 'Inactive'
                })
            }}
            variant={"cancel"}
        >
            {toggleBloggerStatus.isLoading && <SpinnerLoading className="mr-2" />}

            Дизактивувати
        </Button>
    )
}

export default DisactivateBloggerButton
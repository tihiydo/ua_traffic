'use client'

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { api } from '@/trpc/react'
import React from 'react'
import { useUpdateBlogger } from './use-update-blogger'
import { createMessage } from '@/modules/translate-protocol'
import { NOTIFICATION_CODES } from '@/modules/translate-protocol/constants/notifications'
import { routes } from '@/routes'
import { type Blogger } from '@/database/blogger'

type Props = {
    blogger: Blogger
}

const ActivateBloggerButton = ({ blogger }: Props) => {
    const updateBlogger = useUpdateBlogger();
    const notify = api.notification.createNotification.useMutation();
    const toggleBloggerStatus = api.admin.blogger.toggleBloggerStatus.useMutation({
        onSuccess: (blogger) => {
            updateBlogger(blogger)

            notify.mutate({
                text: createMessage({
                    kind: 'code',
                    code: NOTIFICATION_CODES.BLOGGER_APPROVED,
                    values: {
                        channel: `@${blogger.username}`
                    }
                }),
                recipients: {
                    data: [blogger.userId]
                },
                notificationType: 'Blogger',
                additionalHref: `${routes.catalog.link}/${blogger.id}`,
            })
        }
    });

    return (
        <Button
            disabled={toggleBloggerStatus.isLoading}
            onClick={() => {
                toggleBloggerStatus.mutate({
                    bloggerId: blogger.id,
                    newStatus: 'Active'
                })
            }}
            variant={"success"}
        >
            {toggleBloggerStatus.isLoading && <SpinnerLoading className="mr-2" />}

            Активувати
        </Button>
    )
}

export default ActivateBloggerButton
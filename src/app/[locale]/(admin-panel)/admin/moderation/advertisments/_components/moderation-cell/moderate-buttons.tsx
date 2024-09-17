

import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { createMessage } from '@/modules/translate-protocol';
import { NOTIFICATION_CODES } from '@/modules/translate-protocol/constants/notifications';
import { routes } from '@/routes';
import { AdPost } from '@/database/ad-post/post';
import { api } from '@/trpc/react';
import { type AdvertismentPost } from '@prisma/client';
import React from 'react'
import { toast } from 'react-toastify';

type Props = {
    advertisment: AdvertismentPost;
    userId: string
}

const ModerationButtons = ({ advertisment, userId }: Props) => {
    const utils = api.useUtils();
    const mutation1 = api.admin.advertisment.moderateAdvertisment.useMutation({ onSuccess: handleSuccess, onError: handleError });
    const mutation2 = api.admin.advertisment.moderateAdvertisment.useMutation({ onSuccess: handleSuccess, onError: handleError });

    const isLoading = mutation1.isLoading || mutation2.isLoading;

    function handleError(error: { message: string }) {
        toast.error(error.message)
    }

    function handleSuccess(updatedPost?: AdPost) {
        if (!updatedPost) return;
        // @ts-ignore
        utils.admin.advertisment.getModerationAdvertisments.setData(undefined, (prevData) => {
            return prevData?.map(post => {
                return post.id === updatedPost.id
                    ? updatedPost
                    : post
            })
        })
    }

    const notify = api.notification.createNotification.useMutation()

    return (
        <div className="flex">
            <Button
                className="font-bold mx-1"
                variant={"success"}
                disabled={isLoading}
                onClick={() => {
                    mutation1.mutate({ advertismentId: advertisment.id, newStatus: 'Accepted' })
                    notify.mutateAsync({
                        recipients: { data: [userId] },
                        text: createMessage({
                            kind: 'code',
                            code: NOTIFICATION_CODES.ADVERTISER_POST_APPROVED,
                            values: { advertisment: advertisment.title }
                        }),
                        notificationType: "Advertiser",
                        additionalHref: `${routes.advertiser.subRoutes.myPosts.link}/${advertisment.id}`
                    })
                }}
            >
                {mutation1.isLoading && <SpinnerLoading className="mr-2" />}
                Прийняти
            </Button>

            <Button
                onClick={() => {
                    mutation2.mutate({ advertismentId: advertisment.id, newStatus: 'Declined' })
                    notify.mutateAsync({
                        recipients: { data: [userId] },
                        text: createMessage({
                            kind: 'code',
                            code: NOTIFICATION_CODES.ADVERTISER_POST_DECLINED,
                            values: { advertisment: advertisment.title }
                        }),
                        notificationType: "Advertiser",
                        additionalHref: `${routes.advertiser.subRoutes.myPosts.link}/${advertisment.id}`
                    })
                }}
                disabled={isLoading}
                className="font-bold mx-1"
                variant={"cancel"}
            >
                {mutation2.isLoading && <SpinnerLoading className="mr-2" />}
                Відхилити
            </Button>
        </div>
    )
}

export default ModerationButtons
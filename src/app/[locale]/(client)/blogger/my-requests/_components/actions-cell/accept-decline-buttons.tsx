'use client';

import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/trpc/react'
import { type Prisma } from '@prisma/client';
import ExactDateForm from './exact-date-form';
import { toast } from 'react-toastify';
import Translate from '@/components/Translate';
import { useErrorTranslate } from '@/hooks/use-error';
import { type TableData } from '../columns';
import { createMessage } from '@/modules/translate-protocol';
import { NOTIFICATION_CODES } from '@/modules/translate-protocol/constants/notifications';
import { routes } from '@/routes';
import { CheckIcon, XIcon } from 'lucide-react';

type Props = {
    advertismentRequest: TableData
}

const AcceptDeclineButtons = ({ advertismentRequest }: Props) => {
    const { data: averageTime, refetch: refetchAverageTime } = api.blogger.getAverageAcceptanceTime.useQuery({
        bloggerId: advertismentRequest.bloggerId,
    });
    const utils = api.useUtils();
    const notify = api.notification.createNotification.useMutation()
    const translateError = useErrorTranslate();
    const { mutate: declineRequest, isLoading: isDeclining } = api.advertisment.declineRequest.useMutation({
        onSuccess,
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });
    const { mutate: acceptRequest, isLoading: isAccepting } = api.advertisment.acceptRequest.useMutation({
        onSuccess: () => {
            onSuccess();
            refetchAverageTime();
            window.location.reload();
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    function onSuccess(advertismentRequest?: Prisma.AdvertismentRequestGetPayload<{ include: { AdvertismentPost: true, Blogger: true, Chat: true } }>) {
        utils.advertisment.requests.getMyBloggersRequests.setData(undefined, (prevData) => {
            return (prevData ?? []).map(request => (
                request.id === advertismentRequest?.id ? advertismentRequest : request
            ));
        });
    }

    const isLoading = isAccepting || isDeclining;

    console.log('Average Time:', averageTime);

    return (
        <div className='flex gap-2'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        disabled={isLoading}
                        size={'icon'}
                        className="font-bold "
                        variant={"success"}
                    >
                        <CheckIcon />
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Translate namespace='Default' itemKey='accepting' />
                        </DialogTitle>
                    </DialogHeader>

                    <ExactDateForm
                        isLoading={isAccepting}
                        fromDate={advertismentRequest.dateFrom}
                        toDate={advertismentRequest.dateTo}
                        onSubmit={async (exactDate) => {
                            acceptRequest({
                                advertismentRequestId: advertismentRequest.id,
                                exactDate
                            });
                            notify.mutate({
                                recipients: { data: [advertismentRequest.AdvertismentPost.creatorId] },
                                text: createMessage({
                                    kind: 'code',
                                    code: NOTIFICATION_CODES.ADVERTISER_REQ_ACCEPTED,
                                    values: {
                                        advertisment: advertismentRequest.AdvertismentPost.title,
                                        channel: `@${advertismentRequest.Blogger.username}`
                                    }
                                }),
                                notificationType: "Advertiser",
                                additionalHref: `${routes.advertiser.subRoutes.myRequests.link}/${advertismentRequest.id}`
                            });
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Button
                size={'icon'}
                disabled={isLoading}
                onClick={async () => {
                    declineRequest({ advertismentRequestId: advertismentRequest.id });
                    notify.mutate({
                        recipients: { data: [advertismentRequest.AdvertismentPost.creatorId] },
                        text: createMessage({
                            kind: 'code',
                            code: NOTIFICATION_CODES.ADVERTISER_REQ_DECLINED,
                            values: {
                                advertisment: advertismentRequest.AdvertismentPost.title,
                                channel: `@${advertismentRequest.Blogger.username}`
                            }
                        }),
                        notificationType: "Advertiser",
                        additionalHref: `/advertiser/my-requests/${advertismentRequest.id}`
                    });
                }}
                className="font-bold"
                variant={"cancel"}
            >
                {isDeclining ? (
                    <SpinnerLoading />
                ) : (
                    <XIcon />
                )}
            </Button>
        </div>
    );
};

export default AcceptDeclineButtons;

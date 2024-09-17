import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useErrorTranslate } from '@/hooks/use-error';
import { api } from '@/trpc/react';
import React from 'react'
import { toast } from 'react-toastify';

type Props = {
    disabled?: boolean;
    advertismentRequestId: string;
    advertismentPostId: string;
}

const DoneButton = ({ advertismentRequestId, disabled }: Props) => {
    const utils = api.useUtils();
    const translateError = useErrorTranslate();
    const { mutate: doneRequest, isLoading } = api.advertisment.markDoneAdvertisment.useMutation({
        onSuccess: (advertismentRequest) => {
            utils.advertisment.requests.getMyBloggersRequests.setData(undefined, (prevData) => {
                return (prevData ?? []).map(request => (
                    request.id === advertismentRequest?.id ? advertismentRequest : request
                ))
            })
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    })

    return (
        <Button
            disabled={isLoading || disabled}
            onClick={async () => {
                doneRequest({ advertismentRequestId })
            }}
            className="font-bold "
            variant={"success"}
        >
            {isLoading && <SpinnerLoading className='mr-2' />}
            Виконано
        </Button>
    )
}

export default DoneButton
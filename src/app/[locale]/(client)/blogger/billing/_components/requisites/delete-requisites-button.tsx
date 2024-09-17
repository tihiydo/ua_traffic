'use client';

import Translate from '@/components/Translate';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useErrorTranslate } from '@/hooks/use-error';
import { api } from '@/trpc/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'react-toastify';

type Props = {
    requisitesId: string;
}

const DeleteRequisitesButton = ({ requisitesId }: Props) => {
    const utils = api.useUtils();
    const translateError = useErrorTranslate();
    const { mutate: deleteRequisites, isLoading, isSuccess } = api.requisites.delete.useMutation({
        onSuccess: () => {
            utils.requisites.getMyRequisites.setData(undefined, (prevData) => {
                return prevData?.filter(requisites => requisites.id !== requisitesId)
            })
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });


    return (
        <button
            disabled={isLoading || isSuccess}
            type={'button'}
            onClick={() => {
                deleteRequisites({ requisitesId });
            }}
            className='flex justify-between items-center text-gray-secondary duration-150 hover:text-destructive/75 sm:w-[130px] disabled:opacity-50 disabled:hover:text-gray-secondary'
        >
            {isLoading ? (
                <div className='w-full'>
                    <SpinnerLoading className='text-gray-secondary block mx-auto' size={25} />
                </div>
            ) : (
                <>
                    <TrashIcon size={22} />
                    <span className='hidden uppercase sm:block'>
                        <Translate namespace='Blogger' itemKey='delete-requisites' />
                    </span>
                </>
            )
            }

        </button >
    )
}

export default DeleteRequisitesButton
import SpaceAlert from '@/components/ui/custom/space-alert'
import { api } from '@/trpc/react'
import React from 'react'
import DeleteRequisitesButton from './delete-requisites-button'
import { twMerge } from 'tailwind-merge'
import Translate from '@/components/Translate'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'

type Props = 
{
    userId: string
}

const RequisitesTab = (props: Props) => {
    const { data: requisitesList, isLoading } = api.requisites.getMyRequisites.useQuery({userId: props.userId});

    return (
        <div>
            <ul className='max-w-[60rem] w-full border-gray-secondary/50 border-2 shadow-md rounded-md overflow-hidden mb-4'>
                {isLoading ? (
                    <div className='my-8 mx-3 flex justify-center text-gray-secondary'>
                        <SpinnerLoading size={40} />
                    </div>
                ) : (
                    requisitesList?.length ? (
                        requisitesList?.map((requisites, index) => (
                            <li key={requisites.id}>
                                <SpaceAlert
                                    title={requisites.cardNumber}
                                    className={twMerge(
                                        "rounded-none  border-gray-secondary/50 border-0",
                                        index !== (requisitesList?.length ?? 0) - 1 ? 'border-b-2' : ''
                                    )}
                                    jsxValue=
                                        {
                                            <div className='flex gap-x-3 text-gray-last'>
                                                <DeleteRequisitesButton requisitesId={requisites.id} />
                                            </div>
                                        }
                                />
                            </li>
                        ))
                    ) : (
                        <div className='w-full flex justify-center my-8'>
                            <Translate namespace='Blogger' itemKey='notaddedbilling' />
                        </div>
                    )
                )}
            </ul>
        </div>
    )
}

export default RequisitesTab
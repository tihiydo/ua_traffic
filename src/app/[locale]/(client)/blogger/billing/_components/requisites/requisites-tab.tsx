import SpaceAlert from '@/components/ui/custom/space-alert'
import { api } from '@/trpc/react'
import React from 'react'
import DeleteRequisitesButton from './delete-requisites-button'
import RequisitesDialog from './requisites-dialog'
import { twMerge } from 'tailwind-merge'
import Translate from '@/components/Translate'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'



const RequisitesTab = () => {
    const { data: requisitesList, isLoading } = api.requisites.getMyRequisites.useQuery();
    return (
        <div>
            <ul className='max-w-[60rem] w-full border shadow-md rounded-md border-gray-secondary/50 overflow-hidden'>
                {isLoading ? (
                    <div className='my-8 mx-3 flex justify-center text-gray-secondary'>
                        <SpinnerLoading size={40} />
                    </div>
                ) : (
                    requisitesList?.length ? (
                        requisitesList?.map((requisites, index) => (
                            <li
                                key={requisites.id}
                            >
                                <SpaceAlert
                                    title={requisites.cardNumber}
                                    className={twMerge("rounded-none border-gray-secondary/50 border-0", index === requisitesList.length - 1 ? "border-none" : "border-b ")}
                                    fio={requisites.fio}
                                    bankType={requisites.cardBank}
                                    jsxValue={
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


            <div className='mt-5'>
                <RequisitesDialog />
            </div>
        </div >
    )
}

export default RequisitesTab
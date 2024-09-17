'use client';

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocalStorage } from '@/hooks/use-local-storage';
import { MoveLeftIcon } from 'lucide-react'
import React from 'react'
import { IG_VERIF_STATE_PATH, type InstagramVerificationState } from './instagram-tab';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useRouter } from '@/i18n/navigation';
import Translate from '@/components/Translate';

const InstagramBlankLoading = () => {
    const [verificationState, setVerificationState] = useLocalStorage<InstagramVerificationState>(IG_VERIF_STATE_PATH);
    const router = useRouter();

    return (
        <div className='max-w-[40rem]'>
            {/* <Button
                className='underline gap-2'
                onClick={() => {
                    router.refresh()
                    setVerificationState({ igToken: undefined, profileId: undefined })
                }}
                variant={'link'}
            >
                <MoveLeftIcon size={20} />
                Скинути
            </Button> */}

            <h2 className="font-bold uppercase mb-2"><Translate namespace="Blogger" itemKey="channel" /></h2>

            <div className='rounded-md p-3 border border-gray-secondary gap-5 flex items-center mt-2'>
                <Skeleton className='rounded-full h-16 w-16' />

                <div className='flex-1'>
                    <Skeleton className='w-[50vw] sm:w-[50%] h-2.5 mb-1.5' />
                    <Skeleton className='w-[20vw] sm:w-[20%] h-2.5 mb-4' />

                    <Skeleton className='h-2.5 w-[30vw] sm:w-[30%]' />
                </div>
            </div>

            <h2 className="font-bold uppercase mb-2 mt-5 "><Translate namespace="Blogger" itemKey="price" /></h2>
            <div className='w-full p-3 border border-gray-secondary rounded-md flex justify-center items-center h-[300px]'>
                <SpinnerLoading className='w-10 h-10' />
            </div>
        </div>
    )
}

export default InstagramBlankLoading
import Translate from '@/components/Translate';
import SpaceAlert from '@/components/ui/custom/space-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { type User } from '@/types/enities/user';
import { CircleDollarSign } from 'lucide-react';
import React from 'react'

type Props = {
    user?: User;
    isLoading?: boolean;
}

const BillingsTab = ({ user, isLoading }: Props) => {
    return (
        <div className="max-w-[60rem] w-full border-gray border border-1 shadow-md rounded-md">
            <SpaceAlert
                icon={<CircleDollarSign size={30} strokeWidth={1.25} />}
                title={<Translate namespace='Blogger' itemKey='balance' />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.advertiserBalance} ₴`}
                className="border-0 rounded-none border-b-[1px] border-gray-secondary"
            />

            <SpaceAlert
                icon={<CircleDollarSign size={30} strokeWidth={1.25} />}
                title={<Translate namespace="Blogger" itemKey="hold" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.advertiserHoldBalance} ₴`}
                className="border-0 rounded-none border-b-[1px] border-gray-secondary"
            />
        </div>
    )
}

export default BillingsTab
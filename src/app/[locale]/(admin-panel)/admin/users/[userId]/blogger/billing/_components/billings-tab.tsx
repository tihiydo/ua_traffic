import Translate from '@/components/Translate'
import SpaceAlert from '@/components/ui/custom/space-alert'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/trpc/react'
import { CircleDollarSign } from 'lucide-react'

type Props = 
{
    userId: string
}

const Billings = (props: Props) => {
    const { data: user, isLoading } = api.user.getMyUser.useQuery({userId: props.userId});

    return (
        <div className="max-w-[60rem] w-full border-gray border border-1 shadow-md rounded-md">
            <SpaceAlert
                icon={<CircleDollarSign size={30} strokeWidth={1.25} />}
                title={<Translate namespace="Blogger" itemKey="hold" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.bloggerHoldBalance} ₴`}
                className="border-0 rounded-none border-b-[1px] border-gray-secondary"
            />

            <SpaceAlert
                icon={<CircleDollarSign size={30} strokeWidth={1.25} />}
                title={<Translate namespace='Blogger' itemKey='balance' />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.bloggerBalance} ₴`}
                className="border-0 rounded-none border-b-[1px] border-gray-secondary"
            />

            <SpaceAlert
                icon={<CircleDollarSign size={30} strokeWidth={1.25} />}
                title={<Translate namespace="Blogger" itemKey="balancewithdrawal" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.toWithdraw} ₴`}
                className="border-0 rounded-none border-b-[1px] border-gray-secondary"
            />

            <SpaceAlert
                icon={<CircleDollarSign size={30} strokeWidth={1.25} />}
                title={<Translate namespace="Blogger" itemKey="withdrawn" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.totalWithdrawed} ₴`}
                className="border-0 rounded-none border-b-[1px] border-gray-secondary"
            />
        </div>
    )
}

export default Billings
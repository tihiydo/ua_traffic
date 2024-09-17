import Translate from '@/components/Translate'
import SpaceAlert from '@/components/ui/custom/space-alert'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/trpc/react'
import { ArrowRightLeft, CheckCircle2, TimerIcon, WalletIcon } from 'lucide-react'


const Billings = () => {
    const { data: user, isLoading } = api.user.getMyUser.useQuery();

    return (
        <div className="max-w-[60rem] w-full border-gray-secondary/50 border border-1 shadow-md rounded-md overflow-hidden">
            <SpaceAlert
                icon={<TimerIcon size={30} strokeWidth={1.5} />}
                title={<Translate namespace="Blogger" itemKey="hold" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.bloggerHoldBalance} ₴`}
                className="border-0 rounded-none border-b border-gray-secondary/50"
            />

            <SpaceAlert
                icon={<WalletIcon size={30} strokeWidth={1.5} />}
                title={<Translate namespace='Blogger' itemKey='balance' />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.bloggerBalance} ₴`}
                className="border-0 rounded-none border-b border-gray-secondary/50"
            />

            <SpaceAlert
                icon={<ArrowRightLeft size={30} strokeWidth={1.5} />}
                title={<Translate namespace="Blogger" itemKey="balancewithdrawal" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.toWithdraw} ₴`}
                className="border-0 rounded-none border-b border-gray-secondary/50"
            />

            <SpaceAlert
                icon={<CheckCircle2 size={30} strokeWidth={1.5} />}
                title={<Translate namespace="Blogger" itemKey="withdrawn" />}
                value={isLoading ? <Skeleton className='w-32 h-4' /> : `${user?.totalWithdrawed} ₴`}
                className="border-0 rounded-none  border-gray-secondary"
            />
        </div>
    )
}

export default Billings
'use client'

import { api } from '@/trpc/react'
import { CircleDollarSign, Users } from 'lucide-react'
import { animated } from '@react-spring/web'
import SocialIcon from '@/components/ui/social-icon'

const StatPage = () => {
    const { data: adminStatistic, isLoading, isSuccess } = api.statRouter.getAll.useQuery()


    if (!adminStatistic) {
        return;
    }

    return (

        <div className="min-h-[18rem] w-full flex justify-center items-center flex-col gap-5">
            <div className='flex sm:w-[35rem] sm:flex-row flex-col gap-y-[30px]'>
                <div className="flex-1">
                    <div className="items-center flex flex-col gap-y-[2px]">
                        <div className='items-center flex flex-col gap-y-[8px]'>
                            <Users size={60} className='text-[#2e61bb]' />
                            <div className='uppercase font-title bg-yellow font-bold'>
                                Користувачів
                            </div>
                        </div>

                        <div className='text-sm font-bold'>
                            <animated.div>{adminStatistic.users}</animated.div>
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className="items-center flex flex-col gap-y-[2px]">
                        <div className='items-center flex flex-col gap-y-[8px]'>
                            <CircleDollarSign size={60} className='transform rotate-45 text-[#159115]' />
                            <div className='uppercase font-title bg-yellow font-bold'>
                                Поповнень
                            </div>
                        </div>

                        <div className='text-sm font-bold flex gap-x-[2px]'>
                            <div>{adminStatistic.deposit}</div> ₴
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className="items-center flex flex-col gap-y-[2px]">
                        <div className='items-center flex flex-col gap-y-[8px]'>
                            <CircleDollarSign size={60} className='rotate-[-20deg] text-[brown]' />
                            <div className='uppercase font-title bg-yellow font-bold'>
                                Виведень
                            </div>
                        </div>

                        <div className="text-sm font-bold flex gap-x-[2px]">
                            <div>{adminStatistic.withdraw}</div> ₴
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex gap-5 sm:flex-row flex-col gap-y-[30px]'>
                <div className="flex-1">
                    <div className="items-center flex flex-col gap-y-[2px]">
                        <div className='items-center flex flex-col gap-y-[8px]'>
                            <SocialIcon social='Instagram' className='stroke-[#e814b2] size-16' />
                            <div className='uppercase font-title bg-yellow px-0.5 font-bold'>
                                Instagram
                            </div>
                        </div>

                        <div className='text-sm font-bold'>
                            {adminStatistic.instagram}
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className="items-center flex flex-col gap-y-[2px]">
                        <div className='items-center flex flex-col gap-y-[8px]'>
                            <SocialIcon social='Telegram' className='stroke-[#29a9eb] fill-[#29a9eb] !stroke-[0.5px] size-16' />
                            <div className='uppercase font-title bg-yellow px-0.5 font-bold'>
                                Telegram
                            </div>
                        </div>

                        <div className='text-sm font-bold flex gap-x-[2px]'>
                            {adminStatistic.telegram}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StatPage
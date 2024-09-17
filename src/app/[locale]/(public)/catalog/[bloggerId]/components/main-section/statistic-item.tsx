import React from 'react'

type Props = {
    icon: React.ReactNode;
    value: React.ReactNode;
    name: React.ReactNode;
}

const StatisticItem = ({ icon, name, value }: Props) => {
    return (
        <li className='flex items-center flex-col gap-1 w-fit'>
            <div className='text-yellow'>
                {icon}
            </div>

            <div className='font-bold text-center text-sm sm:text-base  md:text-lg'>{value}</div>
            <div className='text-center text-xs sm:text-sm  md:text-base'>{name}</div>
        </li>
    )
}

export default StatisticItem
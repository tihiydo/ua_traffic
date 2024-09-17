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

            <div className='font-bold text-lg text-center'>{value}</div>
            <div className='text-center'>{name}</div>
        </li>
    )
}

export default StatisticItem
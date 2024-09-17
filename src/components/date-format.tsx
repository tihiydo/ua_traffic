

import { format } from 'date-fns'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    date: Date
    className?: string
}

const DateFormat = ({ date, className }: Props) => {
    return (
        <div className={twMerge('font-blod', className)}>
            {format(date, 'dd.MM.yyyy')} {'  '}
            |    {format(date, 'HH:mm')}
        </div>
    )
}

export default DateFormat

import { format } from 'date-fns'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    dateFrom: Date
    dateTo: Date
    className?: string
}

const DateRange = ({ dateFrom, dateTo, className }: Props) => {
    return (
        <div className={twMerge("text-center", className)}>
            <p>
                {format(dateFrom, 'dd.MM.yyyy')} - {' '}
                {format(dateTo, 'dd.MM.yyyy')}
            </p>
            <p>
                З {format(dateFrom, 'HH:mm')} {" "}
                до {format(dateTo, 'HH:mm')}
            </p>
        </div>
    )
}

export default DateRange

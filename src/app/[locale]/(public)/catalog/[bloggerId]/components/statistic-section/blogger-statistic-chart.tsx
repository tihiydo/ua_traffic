'use client'

import React from 'react'
import { AreaChart, Area, Tooltip, YAxis, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { getLocale } from '@/lib/date-fns';
import { useLocale } from 'next-intl';


export type BloggerStatisticItem = {
    value: number;
    timestamp: string;
}

type Props = {
    strokeColor?: string;
    areaColor?: string;
    data: {
        value: number;
        timestamp: number;
    }[]
}

const BloggerStatisticChart = ({
    data,
    areaColor,
    strokeColor
}: Props) => {
    const locale = useLocale();

    return (
        <ResponsiveContainer>
            <AreaChart
                data={data
                    .map(item => ({
                        ...item,
                        timestamp: format(new Date(item.timestamp), 'dd MMMM', { locale: getLocale(locale ?? 'ua') })
                    }))
                    .slice(-30)
                }
            >
                <defs>
                    <linearGradient id={`color${areaColor}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={areaColor ?? "#ffde59"} stopOpacity={0.9} />
                        <stop offset="95%" stopColor={areaColor ?? "#ffde59"} stopOpacity={0} />
                    </linearGradient>
                </defs>

                <YAxis
                    domain={['dataMin', 'dataMax']}
                    width={0}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={strokeColor ?? "#ffde59"} fillOpacity={1} fill={`url(#color${areaColor})`} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

const CustomTooltip = ({ active, payload }: Partial<{ active: boolean, payload: { value: number, payload: BloggerStatisticItem }[], label: string }>) => {
    const data = payload?.[0]?.payload

    if (active && payload && data) {
        return <div className="bg-white p-1 rounded-md text-xs shadow-sm border flex gap-2 font-medium border-gray items-center">
            <h6 className=''>{data.timestamp}</h6>
            <p>|</p>
            <p>{data.value.toLocaleString()}</p>
        </div>
    }

    return null
}

export default BloggerStatisticChart
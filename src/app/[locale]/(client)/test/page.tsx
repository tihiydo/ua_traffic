'use client'

import React from 'react'
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
const data = [
    {
        "name": "Page A",
        "uv": 4000,
        "pv": 2400,
    },
    {
        "name": "Page B",
        "uv": 3000,
        "pv": 1398,
    },
    {
        "name": "Page C",
        "uv": 2000,
        "pv": 9800,
    },
    {
        "name": "Page D",
        "uv": 2780,
        "pv": 3908,
    },
    {
        "name": "Page E",
        "uv": 1890,
        "pv": 4800,
    },
    {
        "name": "Page F",
        "uv": 2390,
        "pv": 3800,
    },
    {
        "name": "Page G",
        "uv": 3490,
        "pv": 4300,
    }
]

const CustomTooltip = ({ active, payload, label }: Partial<{ active: any, payload: any[], label: any }>) => {
    if (active && payload && payload.length) {
        return <div className="custom-tooltip">
            <p className="label">{`${label} : ${payload[0].value}`}</p>
            <div>
                {payload.map((pld) => (
                    <div key={pld.value} style={{ display: "inline-block", padding: 10 }}>
                        <div style={{ color: pld.fill }}>{pld.value}</div>
                        <div>{pld.dataKey}</div>
                    </div>
                ))}
            </div>
        </div>
    }

    return null
}

const Page = () => {
    return (
        <AreaChart width={730} height={250} data={data}
        >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="pv" stroke="#ffde59" fillOpacity={1} fill="#ffde59" />
        </AreaChart>
    )

}

export default Page
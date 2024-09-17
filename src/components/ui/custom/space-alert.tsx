import React, { type ReactNode } from 'react'
import { Alert } from "@/components/ui/alert"
import { cn } from '@/lib/utils'

type Props = {
    icon?: JSX.Element,
    title: string | ReactNode,
    value?: ReactNode,
    fio?: ReactNode,
    bankType?: ReactNode,
    jsxValue?: JSX.Element,
    className?: string
}

const SpaceAlert = (props: Props) => {
    return (
        <Alert className={cn(props.className, "p-0 min-h-[4rem]")}>
            <div className={`${props.icon ? 'grid grid-cols-10' : ''}`}>
                {
                    props.icon &&
                <div className='md:flex hidden min-h-[4rem] col-span-1 items-center justify-center'>
                    {props.icon}
                </div>
                }
                <div className={`flex justify-between min-h-[4rem] w-full items-center col-span-10 md:col-span-9 props.icon ${props.icon ? 'md:pl-0 pl-5 pr-5' : 'px-5'}`}>
                    <div className='flex flex-row gap-x-[20px]'>
                        <div className='uppercase font-bold'>{props.title}</div>
                        {props.fio &&
                            <div className='font-thin text-gray-secondary items-center'>{props.fio} | {props.bankType?.toString().toUpperCase()}</div>
                        }
                    </div>
                    <div className='uppercase font-bold flex'>{props.value ? props.value : props.jsxValue}</div>
                </div>
            </div>
        </Alert>
    )
}

export default SpaceAlert;
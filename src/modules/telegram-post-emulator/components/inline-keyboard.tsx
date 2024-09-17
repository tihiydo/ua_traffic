import React from 'react'
import { type InlineKeyboardItem } from '../types'
import { Link } from '@/i18n/navigation'
import { ArrowUpRightIcon } from 'lucide-react'

type Props = {
    items: InlineKeyboardItem[]
}

const InlineKeyboard = ({ items }: Props) => {
    return (
        <div className='flex flex-wrap gap-1.5 mt-2'>
            {items.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    target='_blank'
                    className='relative bg-[#aab2bb] bg-opacity-70 hover:bg-opacity-55 duration-150  rounded-md text-sm  py-1.5 px-4 text-white flex-1 whitespace-nowrap flex justify-center items-center'
                >
                    <ArrowUpRightIcon className='absolute w-3 h-3 top-0.5 right-0.5' />
                    
                    {item.display}
                </Link>
            ))}
        </div>
    )
}

export default InlineKeyboard
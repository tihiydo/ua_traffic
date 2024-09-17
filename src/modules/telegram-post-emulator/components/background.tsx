import Image from 'next/image'
import telegramEmulatorBg from '@/assets/images/telegram-emulator-bg.jpg'
import React from 'react'

type Props = {}

const Background = ({ }: Props) => {
    return (
        <div className='absolute top-0 left-0 w-full h-full z-[5]'>
            <Image src={telegramEmulatorBg} alt='Background' fill className='object-cover p-[10px]'/>
        </div>
    )
}

export default Background
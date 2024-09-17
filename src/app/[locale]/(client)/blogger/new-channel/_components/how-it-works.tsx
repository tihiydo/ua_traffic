"use client"

import Translate from '@/components/Translate';
import { Lightbulb } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string
    text: string;
}

const HowItWorks = ({ className, text }: Props) => {
    // const { mutateAsync: mutate } = api.user.changeClientHeaderTab.useMutation()
    return (
        <div className={twMerge(`p-4 py-9 rounded-xl top-0 block mx-auto relative mt-14 max-w-[400px] h-fit w-full bg-yellow lg:w-[250px] lg:absolute lg:right-0 lg:-top-14  lg:mt-0`, className)}>
        <div className='absolute -top-6 left-7 bg-main rounded-full text-white p-2'>
            <Lightbulb />
        </div>

        <h2 className='text-lg font-bold mb-2'><Translate namespace="Default" itemKey="howitwork" /></h2>

        <div className='w-full flex flex-col gap-4 md:text-sm text-xs text-[#797979]'>
            {text.split('\n').map((line, index) => (
                <span key={index}>{line}<br/></span>
            ))}
        </div>
    </div>
    )
}

export default HowItWorks
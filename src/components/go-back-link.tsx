'use client'

import Translate from '@/components/Translate';
import { useRouter } from '@/i18n/navigation';
import { ChevronLeftIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge';

type Props = {
    fallbackLink?: string;
    className?: string;
}

const GoBackLink = ({ className }: Props) => {
    const router = useRouter();
    
    return <div
        onClick={() => router.back()}
        className={twMerge(
            "group cursor-pointer uppercase w-fit flex items-center gap-1 text-gray-secondary/80 font-title hover:text-gray-secondary duration-150 ",
            className
        )}
    >
        <ChevronLeftIcon size={25} className='group-hover:-translate-x-1 group-hover:scale-110 -translate-x-0 duration-150' />

        <Translate namespace='Default' itemKey='back' />
    </div>
}


// Better variant for accessablility but need to improve retrieving current and prev url with excluding locales

// const GoBackLink = ({ fallbackLink, className }: Props) => {
//     const headersList = headers()
//     const prevLink = headersList.get('referer');
//     const nextUrl = headersList.get('next-url');
//     const link = prevLink ?? fallbackLink ?? '/'

//     return (
//         <Link
//             href={link}
//             className={twMerge(
//                 "group uppercase w-fit flex items-center gap-1 text-gray-secondary/80 font-title hover:text-gray-secondary duration-150 ",
//                 className
//             )}
//         >
//             {prevLink}
//             {nextUrl}
//             <ChevronLeftIcon size={25} className='group-hover:-translate-x-1 group-hover:scale-110 -translate-x-0 duration-150' />

//             <Translate namespace='Default' itemKey='back' />
//         </Link>
//     )
// }

export default GoBackLink
'use client'
import Image from 'next/image';
import React from 'react'
import StatisticList from './statistic/statistic-list';
import { Link } from '@/i18n/navigation';
import { type Blogger } from '@/database/blogger';

type Props = {
    blogger: Blogger;
};

const BloggerInfo = ({ blogger }: Props) => {
    return (
        <div className='flex gap-10 w-[70%]'>
            <div className='relative w-32 h-32 bg-gray rounded-full overflow-hidden '>
                <Image loader={() => blogger.profilePicture} src={blogger.profilePicture} alt='blogger' fill unoptimized />
            </div>

            <div className='flex-1'>
                <h2 className='text-xl font-title mb-6'>
                    <Link href={blogger.profileLink || ""}>{blogger.username}</Link>
                </h2>

                <StatisticList blogger={blogger} />

            </div>
        </div>
    )
}

export default BloggerInfo
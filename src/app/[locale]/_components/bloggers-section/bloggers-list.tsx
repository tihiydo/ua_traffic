import { api } from '@/trpc/server';
import { type SocialType } from '@prisma/client'
import React from 'react'
import BloggerCard from './blogger-card';
import { SearchX } from 'lucide-react';
import Translate from '@/components/Translate';

type Props = {
    tab: SocialType;
}

const BloggersList = async ({ tab }: Props) => {
    const bloggers = await api.blogger.getManyBloggers.query({
        social: tab,
        take: 4,
        sortBy: 'subs',
        sortOrder: 'desc',
        status: 'Active'
    })



    return (
        <ul className='flex justify-center flex-wrap items-stretch w-full gap-5'>
            {!!bloggers && bloggers.length ? bloggers.map(blogger => (
                <BloggerCard key={blogger.id} blogger={blogger} />
            )) : (
                <div className={'flex flex-col justify-center items-center mt-6 sm:mt-14 md:mt-20'}>
                    <div className='w-[6rem] h-[6rem]  sm:w-[8rem] sm:h-[8rem]'>
                        <SearchX className='block w-full h-full text-yellow' />
                    </div>

                    <h5 className='text-base sm:text-lg font-bold mt-2'>
                        <Translate namespace="Default" itemKey="cantfind" />
                    </h5>
                </div>
            )}
        </ul>
    )
}

export default BloggersList
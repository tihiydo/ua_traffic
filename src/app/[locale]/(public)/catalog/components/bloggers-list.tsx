import React from 'react'
import BloggerCard from './blogger-card';
import { SearchX } from 'lucide-react';
import Translate from '@/components/Translate';
import type { CatalogBlogger } from '@/types/enities/blogger';

type Props = {
    bloggers: CatalogBlogger[];
}

const BloggersList = ({ bloggers }: Props) => {
    return (
        <div className='w-full h-full @container'>
            <div className='w-full grid  gap-4 place-content-center grid-cols-1 @[39rem]:grid-cols-2  @4xl:grid-cols-3'>
                {bloggers.map((blogger, index) => (
                    <BloggerCard isFirst={index === 0} blogger={blogger} key={blogger.id} />
                ))}
            </div>

            {bloggers.length === 0 && (
                <div className={'flex flex-col justify-center items-center mt-6 sm:mt-14 md:mt-20'}>
                    <div className='w-[6rem] h-[6rem]  sm:w-[8rem] sm:h-[8rem]'>
                        <SearchX className='block w-full h-full text-yellow' />
                    </div>

                    <h5 className='text-base sm:text-lg font-bold mt-2'>
                        <Translate namespace="Default" itemKey="cantfind" />
                    </h5>
                </div>
            )}
        </div>
    )
}

export default BloggersList
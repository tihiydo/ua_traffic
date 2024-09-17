import { Button } from '@/components/ui/button';
import React from 'react'
import StatisticList from './statistic-list';
import BloggerAvatar from '@/components/ui/custom/blogger-avatar';
import { Link } from '@/i18n/navigation';
import { type CatalogBlogger } from '@/types/enities/blogger';
import BloggerButtons from './blogger-btns';
import BloggerTagBadge from '@/components/ui/custom/badges/tags/blogger-tag-badge';

type Props = {
    blogger: CatalogBlogger;

};

const BloggerInfo = ({ blogger }: Props) => {
    return (
        <div className='flex gap-10 w-full lg:w-[70%] justify-evenly md:justify-normal'>
            <div className='flex justify-center items-center flex-col'>
                <BloggerAvatar className='sm:w-32 sm:h-32 w-28 h-28' src={blogger.profilePicture} />

                <div className='mt-5 text-center block md:hidden'>
                    <h2 className=''>
                        <Button variant={'link'} asChild>
                            <Link className='font-title ' href={blogger.profileLink || ""} target='_blank'> {blogger.username}</Link>
                        </Button>
                    </h2>

                    <div className='flex flex-wrap justify-center gap-2 mt-3'>
                        {blogger.tags.map(tag => (
                            <BloggerTagBadge key={tag} tag={tag} />
                        ))}
                    </div>
                </div>
            </div>


            <div className='flex-grow-0 md:flex-1'>
                <div className='mb-6 md:flex hidden gap-5'>
                    <h2 >
                        <Button variant={'link'} asChild>
                            <Link className='text-xl font-title' href={blogger.profileLink || ""} target='_blank'>{blogger.username}</Link>
                        </Button>
                    </h2>

                    <div className='flex gap-2 items-center'>
                        {blogger.tags.map(tag => (
                            <BloggerTagBadge key={tag} tag={tag} />
                        ))}
                    </div>
                </div>


                <StatisticList blogger={blogger} />

                <BloggerButtons className='mt-10 hidden md:flex max-w-[300px]' blogger={blogger} />
            </div>
        </div>
    )
}

export default BloggerInfo
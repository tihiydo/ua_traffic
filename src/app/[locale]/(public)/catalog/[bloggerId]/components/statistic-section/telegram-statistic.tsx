import React from 'react'
import BloggerStatisticChart from './blogger-statistic-chart';
import { type CatalogBlogger } from '@/types/enities/blogger';
import StatisticCategoryItem from './statistic-category-item';
import { EyeIcon, UsersIcon } from 'lucide-react';
import Translate from '@/components/Translate';

type Props = {
    blogger: Exclude<CatalogBlogger, { type: 'Instagram' }>;
}

const TelegramStatistic = ({ blogger }: Props) => {
    const followersLastStat = blogger.statistic.followers?.at(-1);
    const coverageLastStat = blogger.statistic.coverage?.at(-1)

    return (
        <>
            {followersLastStat ? (
                <div className='w-full rounded-md border border-gray-secondary p-4 max-w-[500px] mx-auto '>
                    <div className='flex gap-2 font-bold mb-1.5'>
                        <UsersIcon />
                        <h4 className='font-title'>
                            <Translate namespace='Statistic' itemKey='followers-title' />
                        </h4>
                        <p className='ml-5 block'>{blogger.followersCount.toLocaleString()}</p>
                    </div>

                    <div className='flex flex-col gap-2 xss:flex-row xss:justify-between xss:items-center lg:flex-col xl:flex-row xl:items-center xl:justify-between'>
                        <div className='text-sm grid grid-cols-2 gap-1 font-medium'>
                            <>
                                <h5 className='whitespace-nowrap w-fit'>
                                    <Translate namespace='Statistic' itemKey='yesterday' />
                                </h5>

                                <StatisticCategoryItem show={!!blogger.statistic.followers?.length} item={followersLastStat.daily} />
                            </>

                            <>
                                <h5 className='whitespace-nowrap w-fit'>
                                    <Translate namespace='Statistic' itemKey='week' />
                                </h5>
                                <StatisticCategoryItem show={!!blogger.statistic.followers?.length && blogger.statistic.followers.length >= 7} item={followersLastStat.weekly} />
                            </>

                            <>
                                <h5 className='whitespace-nowrap w-fit'>
                                    <Translate namespace='Statistic' itemKey='month' />
                                </h5>
                                <StatisticCategoryItem show={!!blogger.statistic.followers?.length && blogger.statistic.followers.length >= 30} item={followersLastStat.monthly} />
                            </>
                        </div>


                        <div className='min-w-[110px]  w-[150px] lg:w-[200px] xl:w-[150px] mx-auto xss:mx-0 lg:mx-auto xl:mx-0 aspect-[3/2]'>
                            <BloggerStatisticChart
                                data={blogger.statistic.followers
                                    ? blogger.statistic.followers.map(item => ({
                                        timestamp: Number(item.timestamp),
                                        value: item.value
                                    }))
                                    : []}
                            />
                        </div>
                    </div>
                </div>
            ) : null}

            {coverageLastStat ? (
                <div className='w-full rounded-md border border-gray-secondary p-4 max-w-[500px] mx-auto '>
                    <div className='flex gap-2 font-bold mb-1.5'>
                        <EyeIcon />
                        <h4 className='font-title'>
                            <Translate namespace='Statistic' itemKey='coverage-title' />
                        </h4>
                        <p className='ml-5 block'>{blogger.coverage ? blogger.coverage.toLocaleString() : 'N/A'}</p>
                    </div>

                    <div className='flex flex-col gap-2 xss:flex-row xss:justify-between xss:items-center lg:flex-col xl:flex-row xl:items-center xl:justify-between'>
                        <div className='text-sm grid grid-cols-2 gap-1 font-medium'>
                            <>
                                <h5 className='whitespace-nowrap w-fit'>
                                    <Translate namespace='Statistic' itemKey='yesterday' />
                                </h5>
                                <StatisticCategoryItem show={!!blogger.statistic.coverage?.length} item={coverageLastStat.daily} />
                            </>

                            <>
                                <h5 className='whitespace-nowrap w-fit'>
                                    <Translate namespace='Statistic' itemKey='week' />
                                </h5>
                                <StatisticCategoryItem show={!!blogger.statistic.coverage?.length && blogger.statistic.coverage.length >= 7} item={coverageLastStat.weekly} />
                            </>

                            <>
                                <h5 className='whitespace-nowrap w-fit'>
                                    <Translate namespace='Statistic' itemKey='month' />
                                </h5>
                                <StatisticCategoryItem show={!!blogger.statistic.coverage?.length && blogger.statistic.coverage.length >= 30} item={coverageLastStat.monthly} />
                            </>
                        </div>


                        <div className='min-w-[110px]  w-[150px] lg:w-[200px] xl:w-[150px] mx-auto xss:mx-0 lg:mx-auto xl:mx-0 aspect-[3/2]'>
                            <BloggerStatisticChart
                                areaColor='#92bcf7'
                                strokeColor='#b3cdf2'
                                data={blogger.statistic.coverage
                                    ? blogger.statistic.coverage.map(item => ({
                                        timestamp: Number(item.timestamp),
                                        value: item.value
                                    }))
                                    : []}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default TelegramStatistic
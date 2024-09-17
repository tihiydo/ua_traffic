"use client"

import FiltersSheet from '../components/filters/filters-sheet'
import BloggersList from '../components/bloggers-list'
import { TAKE_ITEMS } from '../constants'
import SearchInput from '../components/filters/search-input'
import Pagination from '../components/filters/pagination'
import { type FilterSettings } from '@/server/api/routers/blogger/procedures/get-catalog-bloggers'
import InstagramFilters from './instagram-filter'
import type { CatalogBlogger } from '@/types/enities/blogger'
import { twMerge } from 'tailwind-merge'


type Props = {
    pageBloggers: CatalogBlogger[];
    totalBloggersCount: number;
    filterSettings: FilterSettings;
}


const InstagramTab = ({ pageBloggers, totalBloggersCount, filterSettings }: Props) => {
    return (
        <div className="@container/catalog-tab">
            <div className='grid grid-cols-2 @5xl/catalog-tab:grid-cols-3 @[72rem]/catalog-tab:grid-cols-4 gap-x-5 ' id="instagram">
                <div className='col-span-2 @[72rem]/catalog-tab:col-span-3 '>
                    <div className='flex w-full justify-between gap-5 mb-5'>
                        <SearchInput />

                        <FiltersSheet>
                            <div className='mt-8'>
                                <InstagramFilters settings={filterSettings} />
                            </div>
                        </FiltersSheet>
                    </div>

                    <div className='w-full flex-1 flex flex-col items-center'>
                        <BloggersList bloggers={pageBloggers} />

                        {!!totalBloggersCount && (
                            <Pagination className='mt-5' itemsCount={totalBloggersCount} take={TAKE_ITEMS} />
                        )}
                    </div>
                </div>


                <div className={twMerge('hidden @5xl/catalog-tab:block  -mt-11')}>
                    <InstagramFilters settings={filterSettings} />
                </div>
            </div>
        </div>
     
    )
}

export default InstagramTab
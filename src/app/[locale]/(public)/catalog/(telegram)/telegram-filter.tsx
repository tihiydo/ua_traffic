'use client'

import CategorySelect from '../components/filters/category-select';
import SortOrderSelect from '../components/filters/sort-order-select';
import { type FilterSettings } from '@/server/api/routers/blogger/procedures/get-catalog-bloggers';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import FilterSlider from '../components/filters/filter-slider';
import SortBySelect from '../components/filters/sort-by-select';
import PostTypesSelect from '../components/filters/post-types-select';
import Translate from '@/components/Translate';
import { type CatalogSearchParamsSchema } from '../schema';
import { useCatalogParams } from '../hooks/use-catalog-params';
import { TelegramAdPostType } from '@/database/ad-post/post/post-types';
import SavedTabLink from '../components/saved-tab-link';
import TagSelect from '../components/filters/tag-select';

type Props = {
    settings: FilterSettings;
}

const TelegramFilters = ({ settings }: Props) => {
    const { update, merge, schemaParams, include } = useCatalogParams(settings);
    const [filters, setFilters] = useState<CatalogSearchParamsSchema>({
        ...settings,
        ...schemaParams
    });




    return (
        <div>
            <div className='mb-3 flex justify-center'>
                <SavedTabLink />
            </div>

            <div className='flex gap-3 items-center justify-between mb-6'>
                <h4 className='font-title text-lg'><Translate namespace="Default" itemKey="filters" /></h4>

                <Button
                    type='button'
                    variant={'link'}
                    className='text-sm'
                    onClick={() => {
                        setFilters({
                            ...settings
                        });
                        include(['tab', 'search', 'page'])
                    }}
                >
                    <Translate namespace='Default' itemKey='clean' />
                </Button>
            </div>
            <h5 className='text-sm font-bold mb-3'>
                <Translate namespace='Catalogue' itemKey="category" />
            </h5>
            <CategorySelect
                value={filters.category}
                onChange={(value) => {
                    const realValue = value || "all"
                    if (realValue == "all") {
                        update('category', undefined)
                        setFilters({ ...filters, category: undefined })
                    } else {
                        update('category', value)
                        setFilters({ ...filters, category: value })
                    }

                }}
            />

            <div className='mt-5'>
                <h5 className='text-sm font-bold mb-3'>
                    <Translate namespace='Catalogue' itemKey="tags-label" />
                </h5>
                <TagSelect
                    value={filters.tag}
                    onChange={(value) => {
                        const realValue = value || "all"
                        if (realValue == "all") {
                            update('tag', undefined)
                            setFilters({ ...filters, tag: undefined })
                        } else {
                            update('tag', value)
                            setFilters({ ...filters, tag: value })
                        }

                    }}
                />
            </div>

            <div className='mt-5'>
                <h5 className='text-sm font-bold mb-3'>
                    <Translate namespace='Catalogue' itemKey='posttype' />
                </h5>
                <PostTypesSelect
                    postTypes={Object.values(TelegramAdPostType)}
                    value={Object.values(TelegramAdPostType).includes(filters.postType as TelegramAdPostType) ? filters.postType as TelegramAdPostType : undefined}
                    onChange={(value) => {
                        const realValue = value || "all"
                        if (realValue == "all") {
                            merge({
                                postType: undefined,
                                minPrice: undefined,
                                maxPrice: undefined,
                                sortBy: 'subs'
                            })
                            setFilters({
                                ...filters,
                                postType: undefined,
                                maxPrice: undefined,
                                minPrice: undefined,
                                sortBy: 'subs'
                            })
                        } else {
                            merge({
                                postType: value,
                                minPrice: undefined,
                                maxPrice: undefined
                            })
                            setFilters({
                                ...filters,
                                postType: value,
                                maxPrice: undefined,
                                minPrice: undefined,
                            })
                        }

                    }} />
            </div>

            {!!filters.postType && settings.minPrice >= 0 && settings.maxPrice > 0 && (
                <FilterSlider
                    onChange={(value) => {
                        if (!schemaParams.postType) return;

                        setFilters({
                            ...filters,
                            minPrice: value[0],
                            maxPrice: value[1],
                        })

                        merge({
                            minPrice: value[0],
                            maxPrice: value[1],
                        })
                    }}
                    value={[filters.minPrice ?? settings.minPrice, filters.maxPrice ?? settings.maxPrice]}
                    label={<Translate namespace='Catalogue' itemKey="price" />}
                    min={settings.minPrice}
                    max={settings.maxPrice}
                />
            )}


            <FilterSlider
                onChange={(value) => {
                    setFilters({
                        ...filters,
                        minSubs: value[0],
                        maxSubs: value[1],
                    })

                    merge({
                        minSubs: value[0],
                        maxSubs: value[1],
                    })
                }}
                value={[filters.minSubs ?? settings.minSubs, filters.maxSubs ?? settings.maxSubs]}
                label={<Translate namespace='Catalogue' itemKey="followers" />}
                min={settings.minSubs}
                max={settings.maxSubs}
            />

            <div>
                <h4 className='font-title text-lg mt-8'><Translate namespace='Catalogue' itemKey="sort" /></h4>
                <div className='w-full mt-6'>
                    <div>
                        <h5 className='text-sm font-bold mb-3'>
                            <Translate namespace='Catalogue' itemKey="sortby" />
                        </h5>
                        <SortBySelect
                            defaultValue='subs'
                            value={filters.sortBy}
                            onChange={(value) => {
                                const newSortOrder = value === 'rating' ? 'desc' : filters.sortOrder;
        
                                merge({
                                    sortBy: value,
                                    sortOrder: newSortOrder
                                });
        
                                setFilters({ 
                                    ...filters, 
                                    sortBy: value, 
                                    sortOrder: newSortOrder 
                                });
                            }}
                        />

                    </div>

                    <div className='mt-3'>
                        <h5 className='text-sm font-bold mb-3'>
                            <Translate namespace='Catalogue' itemKey="sortorder" />
                        </h5>
                        <SortOrderSelect
                            defaultValue='desc'
                            value={filters.sortOrder}
                            onChange={(value) => {
                                update('sortOrder', value)
                                setFilters({ ...filters, sortOrder: value })
                            }}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TelegramFilters
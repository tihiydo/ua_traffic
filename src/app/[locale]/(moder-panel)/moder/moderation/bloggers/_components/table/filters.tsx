import Translate from '@/components/Translate';
import ComboBox from '@/components/ui/combo-box';
import { BloggerStatus, BloggerCategory } from '@prisma/client'
import { z } from 'zod'

const filtersSchema = z.object({
    status: z.nativeEnum(BloggerStatus),
    category: z.nativeEnum(BloggerCategory),
}).partial();

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const BloggerFilters = ({ onChange, filters }: Props) => {
    return (
        <div className="flex gap-4 items-center">
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold block'>Статус</h5>
                <ComboBox
                    value={filters?.status}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.status
                            ? selectedValue as BloggerStatus
                            : undefined;
                        onChange({ ...filters, status: newValue })
                    }}
                    placeholder='Статус'
                    items={Object.values(BloggerStatus).map(status => ({
                        label: <Translate namespace='Blogger-Status' itemKey={status} />,
                        value: status.toLowerCase()
                    }))}
                />
            </div>
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold block'>Категорія</h5>
                <ComboBox
                    value={filters?.category}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.category
                            ? selectedValue as BloggerCategory
                            : undefined;
                        onChange({ ...filters, category: newValue })
                    }}
                    placeholder='Категорія'
                    items={Object.values(BloggerCategory).map(category => ({
                        label: <Translate namespace='Categories' itemKey={category} />,
                        value: category.toLowerCase()
                    }))}
                />
            </div>
        </div>
    )
}

export default BloggerFilters;
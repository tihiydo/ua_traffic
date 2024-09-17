import Translate from '@/components/Translate';
import ComboBox from '@/components/ui/combo-box';
import { BloggerStatus, SocialType } from '@prisma/client'
import { z } from 'zod'

const filtersSchema = z.object({
    social: z.nativeEnum(SocialType).nullable(),
    bloggerStatus: z.nativeEnum(BloggerStatus).nullable(),
}).partial();

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const Filters = ({ onChange, filters }: Props) => {
    const createComboBoxItems = (enumObject: object) => [
        { label: <Translate namespace='Default' itemKey='all' />, value: 'all' },
        ...Object.values(enumObject).map(value => ({
            label: <Translate namespace={enumObject === BloggerStatus ? 'Blogger-Status' : 'Socials'} itemKey={value} />,
            value: value.toLowerCase()
        }))
    ];

    return (
        <div className="flex mb-4 items-center gap-7">
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold'><Translate namespace='Blogger' itemKey='status' /></h5>
                <ComboBox
                    value={filters?.bloggerStatus?.toLowerCase() || 'all'}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue === 'all' ? null : selectedValue as BloggerStatus;
                        onChange({ ...filters, bloggerStatus: newValue })
                    }}
                    placeholder='Статус блогера'
                    items={createComboBoxItems(BloggerStatus)}
                />
            </div>
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold'><Translate namespace='Blogger' itemKey='socialnetwork' /></h5>
                <ComboBox
                    value={filters?.social?.toLowerCase() || 'all'}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue === 'all' ? null : selectedValue as SocialType;
                        onChange({ ...filters, social: newValue })
                    }}
                    placeholder={<Translate namespace='Blogger' itemKey='socnetwork' />}
                    items={createComboBoxItems(SocialType)}
                />
            </div>
        </div>
    )
}

export default Filters
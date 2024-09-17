import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/combo-box';
import { AdvertismentPostStatus, SocialType } from '@prisma/client'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { z } from 'zod'

const filtersSchema = z.object({
    social: z.nativeEnum(SocialType).nullable(),
    moderationStatus: z.nativeEnum(AdvertismentPostStatus).nullable(),
}).partial();

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const Filters = ({ onChange, filters }: Props) => {
    const t = useTranslations();

    const createComboBoxItems = (enumObject: object) => [
        { label: <Translate namespace='Default' itemKey='all' />, value: 'all' },
        ...Object.values(enumObject).map(value => ({
            label: <Translate namespace={enumObject === AdvertismentPostStatus ? 'Advertisment-Post-Status' : 'Socials'} itemKey={value} />,
            value: value.toLowerCase()
        }))
    ];
    
    return (
        <div className="flex mb-4 items-center gap-7">
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold'><Translate namespace='Default' itemKey='status' /></h5>
                <ComboBox
                    value={filters?.moderationStatus?.toLowerCase() || 'all'}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue === 'all' ? null : selectedValue as AdvertismentPostStatus;
                        onChange({ ...filters, moderationStatus: newValue })
                    }}
                    placeholder={t('Default.status')}
                    items={createComboBoxItems(AdvertismentPostStatus)}
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
                    placeholder={<Translate namespace='Blogger' itemKey='socialnetwork' />}
                    items={createComboBoxItems(SocialType)}
                />
            </div>
        </div>
    )
}

export default Filters
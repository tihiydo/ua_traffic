import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/combo-box';
import { AdvertismentPostStatus, SocialType } from '@prisma/client'
import { z } from 'zod'

const filtersSchema = z.object({
    social: z.nativeEnum(SocialType),
    moderationStatus: z.nativeEnum(AdvertismentPostStatus),
}).partial();

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const Filters = ({ onChange, filters }: Props) => {
    return (
        <div>
            <div className='flex gap-3 items-center justify-between mb-6 mt-5'>
                <h4 className='font-title text-lg'><Translate namespace="Default" itemKey="filters" /></h4>

                <Button
                    type='button'
                    variant={'link'}
                    className='text-sm'
                    onClick={() => {
                        onChange({})
                    }}
                >
                    <Translate namespace='Default' itemKey='clean' />
                </Button>
            </div>


            <div className='mt-6'>
                <h5 className='font-bold block'>Статус поста </h5>

                <ComboBox
                    value={filters?.moderationStatus}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.moderationStatus
                            ? selectedValue as AdvertismentPostStatus
                            : undefined;

                        onChange({ ...filters, moderationStatus: newValue })
                    }}
                    placeholder='Статус'
                    items={Object.values(AdvertismentPostStatus).map(status => ({
                        label: <Translate namespace='Advertisment-Post-Status' itemKey={status} />,
                        value: status.toLowerCase()
                    }))}
                />
            </div>




            <div className='mt-6'>
                <h5 className='font-bold'><Translate namespace='Blogger' itemKey='socialnetwork' /></h5>
                <ComboBox
                    value={filters?.social}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.social
                            ? selectedValue as SocialType
                            : undefined;

                        onChange({ ...filters, social: newValue })
                    }}
                    placeholder={<Translate namespace='Blogger' itemKey='socialnetwork' />}
                    items={Object.values(SocialType).map(social => ({
                        label: <Translate namespace='Socials' itemKey={social} />,
                        value: social.toLocaleLowerCase()
                    }))}
                />
            </div>

        </div>

    )
}

export default Filters
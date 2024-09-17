import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/combo-box';
import { AdvertismentRequestStatus, SocialType } from '@prisma/client'
import { z } from 'zod'

const filtersSchema = z.object({
    social: z.nativeEnum(SocialType),
    requestStatus: z.nativeEnum(AdvertismentRequestStatus),
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
                <h5 className='font-bold block'>Статус поста</h5>

                <ComboBox
                    value={filters?.requestStatus}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.requestStatus
                            ? selectedValue as AdvertismentRequestStatus
                            : undefined;

                        onChange({ ...filters, requestStatus: newValue })
                    }}
                    placeholder='Статус'
                    items={Object.values(AdvertismentRequestStatus).map(status => ({
                        label: <Translate namespace='Advertisment-Request-Status' itemKey={status} />,
                        value: status.toLowerCase()
                    }))}
                />
            </div>

        </div>

    )
}

export default Filters
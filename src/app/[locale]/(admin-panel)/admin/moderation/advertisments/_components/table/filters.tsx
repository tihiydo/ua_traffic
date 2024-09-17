import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/combo-box';
import { AdvertismentPostStatus, SocialType } from '@prisma/client'
import { z } from 'zod'

const filtersSchema = z.object({
    social: z.nativeEnum(SocialType),
    requestStatus: z.nativeEnum(AdvertismentPostStatus),
}).partial();

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const Filters = ({ onChange, filters }: Props) => {
    return (
        <div className="flex gap-4 items-center">
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold block'>Статус поста</h5>

                <ComboBox
                    value={filters?.requestStatus}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.requestStatus
                            ? selectedValue as AdvertismentPostStatus
                            : undefined;

                        onChange({ ...filters, requestStatus: newValue })
                    }}
                    placeholder='Статус'
                    items={Object.values(AdvertismentPostStatus).map(status => ({
                        label: <Translate namespace='Advertisment-Post-Status' itemKey={status} />,
                        value: status.toLowerCase()
                    }))}
                />
            </div>
        </div>
    )
}

export default Filters;

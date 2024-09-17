import Translate from '@/components/Translate';
import ComboBox from '@/components/ui/combo-box';
import { AdvertismentRequestStatus, SocialType } from '@prisma/client';
import { z } from 'zod';

const filtersSchema = z.object({
    social: z.nativeEnum(SocialType),
    requestStatus: z.nativeEnum(AdvertismentRequestStatus),
}).partial();

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData;
}

const Filters = ({ onChange, filters }: Props) => {
    return (
        <div className="flex gap-4 items-center">
            <div className='flex flex-col gap-3'>
                <h5 className='font-bold'>Статус поста</h5>
                <ComboBox
                    value={filters?.requestStatus}
                    onSelect={(selectedValue) => {
                        const newValue = selectedValue !== filters?.requestStatus
                            ? selectedValue as AdvertismentRequestStatus
                            : undefined;
                        onChange({ ...filters, requestStatus: newValue });
                    }}
                    placeholder='Статус'
                    items={Object.values(AdvertismentRequestStatus).map(status => ({
                        label: <Translate namespace='Advertisment-Request-Status' itemKey={status} />,
                        value: status.toLowerCase()
                    }))}
                />
            </div>
        </div>
    );
}

export default Filters;

import ComboBox from '@/components/ui/combo-box';
import { z } from 'zod'

const filtersSchema = z.object
({
    isActive: z.union([z.literal("all"), z.literal("banned"), z.literal("notbanned")])
})

export type FiltersData = z.infer<typeof filtersSchema>;

type Props = {
    onChange: (filters: FiltersData) => void;
    filters?: FiltersData
}

const Filters = ({ onChange, filters }: Props) => {
    return (
        <div>


            <div className='mt-3'>
                <h5 className='font-bold block'>Статус користувача</h5>

                <ComboBox
                    value={filters?.isActive}
                    onSelect={(selectedValue) => {
                        const selected = filtersSchema.safeParse({isActive: selectedValue})
                        if(selected.success) {
                            onChange(selected.data)
                        }
                    }
                    }
                    placeholder='Статус'
                    items={[{label: "Усі", value: "all"}, {label: "Заблокованний", value: "banned"}, {label: "Не заблокованнй", value: "notbanned"}]}
                />
            </div>

        </div>

    )
}

export default Filters
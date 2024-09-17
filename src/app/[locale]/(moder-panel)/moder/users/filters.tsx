import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/combo-box';
import { User } from '@prisma/client'
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
            <div className='flex gap-3 items-center justify-between mb-6 mt-5'>
                <h4 className='font-title text-lg'><Translate namespace="Default" itemKey="filters" /></h4>

                <Button
                    type='button'
                    variant={'link'}
                    className='text-sm'
                    onClick={() => {
                        onChange({isActive: "all"})
                    }}
                >
                    <Translate namespace='Default' itemKey='clean' />
                </Button>
            </div>


            <div className='mt-6'>
                <h5 className='font-bold block'>Статус користувача</h5>

                <ComboBox
                    value={filters?.isActive}
                    onSelect={(selectedValue) => 
                        {
                            const selected = filtersSchema.safeParse({isActive: selectedValue})
                            if(selected.success)
                            {
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
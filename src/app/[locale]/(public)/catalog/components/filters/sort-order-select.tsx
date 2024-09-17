import Translate from "@/components/Translate";
import Select from "@/components/select";

type OrderType = 'asc' | 'desc';

type Props = {
    defaultValue?: OrderType;
    onChange: (value?: OrderType) => void;
    value: OrderType | undefined
}

const items = [
    {
        value: 'asc' as const,
        displayValue: <Translate namespace='Catalogue' itemKey="fromlittletobig" />
    },
    {
        value: 'desc' as const,
        displayValue: <Translate namespace='Catalogue' itemKey="frombigtolittle" />
    }
]

const SortOrderSelect = ({ value, onChange, defaultValue }: Props) => {
    return (
        <Select
            defaultValue={defaultValue}
            items={items}
            value={value}
            onChange={(value) => {
                onChange(value)
            }}
            placeholder={<Translate namespace='Catalogue' itemKey="sortorder" />}
        />

    )
}

export default SortOrderSelect
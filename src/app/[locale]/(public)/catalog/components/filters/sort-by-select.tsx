import Translate from "@/components/Translate";
import Select from "@/components/select";
import { useCatalogParams } from "../../hooks/use-catalog-params";


type Props = {
    defaultValue?: 'price' | 'subs' | 'discount' | 'rating';
    value: 'price' | 'subs' | 'discount' | 'rating' | undefined;
    onChange: (value?: 'price' | 'subs' | 'discount' | 'rating') => void;

}

const SortBySelect = ({ onChange, value, defaultValue }: Props) => {
    const { schemaParams } = useCatalogParams()


    
    return (
        <Select
            defaultValue={defaultValue}
            items={[
                {
                    value: 'price' as const,
                    displayValue: <Translate namespace='Catalogue' itemKey="forprice" />,
                    disabled: !schemaParams.postType
                },
                {
                    value: 'subs' as const,
                    displayValue: <Translate namespace='Catalogue' itemKey="forfollwers" />
                },
                {
                    value: 'discount' as const,
                    displayValue: <Translate namespace='Catalogue' itemKey="fordiscount" />,
                },
                {
                    value: 'rating' as const,
                    displayValue: <Translate namespace='Catalogue' itemKey="forrating" />
                }
            ]}
            value={value}
            onChange={(value) => {
                onChange(value)
            }}
            placeholder={<Translate namespace='Catalogue' itemKey="sortby" />}
        />
    )
}

export default SortBySelect
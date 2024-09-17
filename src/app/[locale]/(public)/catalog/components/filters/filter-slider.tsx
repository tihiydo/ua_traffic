import FormRangeSlider from '@/components/ui/custom/form/form-range-slider'
import { useDebounce } from '@/hooks/use-debounce';
import React, { useEffect, useState } from 'react'
import deepEqual from 'fast-deep-equal'

type Props = {
    min: number;
    max: number;
    label: React.ReactNode;
    value: [number, number]
    onChange: (value: [number, number]) => void;
}

const FilterSlider = ({ max, min, onChange, value, label }: Props) => {
    const [innerValue, setInnerValue] = useState<[number, number]>(value);
    const debouncedValue = useDebounce(innerValue);


    useEffect(() => {
        if (deepEqual(value, innerValue)) return;

        setInnerValue(value);
    }, [value])

    useEffect(() => {
        onChange(debouncedValue)
    }, [debouncedValue])

    useEffect(() => {
        setInnerValue([min, max]);
    }, [min, max])

    if (min === max) {
        return null
    }

    return (
        <div className='mt-5'>
            <h5 className='text-sm font-bold mb-3'>{label}</h5>

            <FormRangeSlider
                value={innerValue}
                onChange={(value) => {
                    setInnerValue(value)
                }}
                max={max}
                min={min}
            />
        </div>
    )
}

export default FilterSlider
'use client';

import { useEffect, useState } from 'react';
import { Input } from '../../input';

type Props = {
    value: [number, number];
    onChange: (value: [number, number]) => void;
    debounceTime?: number;
    max: number;
    min: number;
    minDistance?: number;
}

const FormRangeSlider = ({ value, onChange, max, min, minDistance }: Props) => {
    const [minInputValue, setMinInputValue] = useState(min);
    const [maxInputValue, setMaxInputValue] = useState(max);

    useEffect(() => {
        setMinInputValue(value[0])
        setMaxInputValue(value[1])
    }, [value])
    
    return (
        <div>
            <div className='flex items-center gap-3 mb-3'>
                <Input
                    className='w-[80px] p-1.5 h-fit text-sm'
                    value={minInputValue}
                    onChange={(e) => {
                        let newMinValue = parseInt(e.target.value);
                        if (Number.isNaN(newMinValue)) newMinValue = 0;

                        setMinInputValue(newMinValue)

                        if (newMinValue >= min && newMinValue <= value[1]) {
                            onChange([newMinValue, value[1]])
                        }
                    }}
                />
                <div>
                    -
                </div>
                <Input
                    className='w-[100px] p-1.5 h-fit text-sm'

                    value={maxInputValue}
                    onChange={(e) => {
                        let newMaxValue = parseInt(e.target.value);
                        if (Number.isNaN(newMaxValue)) newMaxValue = 0;

                        setMaxInputValue(newMaxValue)

                        if (newMaxValue <= max && newMaxValue >= value[0]) {
                            onChange([value[0], newMaxValue])
                        }

                    }}
                />
            </div>

            <RangeSlider
                min={min}
                max={max}
                value={value}
                onChange={(values => {
                    onChange(values)
                })}
                minDistance={minDistance}
            />
        </div>
    )
}

export default FormRangeSlider

import RangeSlider from '../range-slider';


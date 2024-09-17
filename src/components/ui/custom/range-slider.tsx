import Slider, { type ReactSliderProps } from 'react-slider'
import { twMerge } from 'tailwind-merge'

type Props = ReactSliderProps<[number, number]>

const RangeSlider = ({ ...props }: Props) => {
    return (
        <Slider
            className='h-5'
            {...props}
            renderTrack={({ key, ...props }, { index }) => (
                <div
                    key={key}
                    {...props}
                    className={
                        twMerge(
                            'h-2',
                            index === 1 ? 'bg-yellow' : 'bg-gray',
                            (index === 0 || index === 2) ? 'rounded-lg' : ''
                        )
                    }
                />
            )}

            renderThumb={({ key, ...props }) => (
                <div
                    key={key}
                    {...props}
                    className={twMerge('h-4 w-4 bg-white -translate-y-1/4 rounded-full border-main border-2')}
                />
            )}

        />
    )
}

export default RangeSlider
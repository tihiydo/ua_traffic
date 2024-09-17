import React from 'react'
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwiper } from 'swiper/react';

type Props = {
    isEnd: boolean;
    isStatrt: boolean;
}

const SwiperControls = ({ isEnd, isStatrt }: Props) => {
    const swiper = useSwiper()

    return (
        <div className='flex items-center gap-2 justify-center mt-5'>
            <Button
                disabled={isStatrt}
                variant={'outline'}
                size={'icon'}
                onClick={() => {
                    swiper.slidePrev()
                }}
            >
                <ChevronLeft />
            </Button>

            <Button
                disabled={isEnd}
                variant={'outline'}
                size={'icon'}
                onClick={() => {
                    swiper.slideNext()
                }}
            >
                <ChevronRight />
            </Button>
        </div>
    )
}

export default SwiperControls
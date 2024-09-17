'use client'

import { Swiper as LibSwiper, type SwiperProps } from 'swiper/react';
import 'swiper/css';


import React, { useState } from 'react'
import SwiperControls from './swiper-controls';

type Props = {
    className?: string;
    children: React.ReactNode;
} & SwiperProps;

const Swiper = ({ className, children, breakpoints, ...props }: Props) => {
    const [isBeginning, setIsBeginning] = useState<boolean>(true)
    const [isEnd, setIsEnd] = useState<boolean>(true)
    const showNav = !(isEnd && isBeginning)



    return (
        <LibSwiper
            className={className}
            onSwiper={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd)
            }}
            onSlideChange={(e) => {
                setIsBeginning(e.isBeginning)
                setIsEnd(e.isEnd)
            }}
            style={{ paddingInline: '12px' }}
            spaceBetween={15}
            breakpoints={breakpoints ?? {
                425: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 15,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    spaceBetween: 15,
                },
                1220: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
            }}
            {...props}
        >
            {showNav && (
                <SwiperControls
                    isEnd={isEnd}
                    isStatrt={isBeginning}
                />
            )}


            {
                children
            }
        </LibSwiper>
    )
}

export default Swiper

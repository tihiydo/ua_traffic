"use client"

import { env } from '@/env.mjs';
import { useGuideStore } from '@/modules/guide';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    children: React.ReactNode;
}

const HeaderBase = ({ children }: Props) => {
    const isGuideOpened = useGuideStore(state => state.isOpened);
    const path = usePathname();
    const [isNeededPage, setIsNeededPage] = useState<boolean>(false);

    useEffect(() => {
        if (path.includes("/catalog") || path.includes("/blogger") || path.includes("/advertiser")) {
            setIsNeededPage(true);
        }
    }, [path]);

    return (
        <header className={twMerge('text-white w-full', isGuideOpened ? "pr-0" : "")}>
            <div className={twMerge('w-full bg-main py-3 md:py-5 px-[14px] md:px-[20px] lg:px-[32px] 2xl:px-[40px] relative', isGuideOpened && isNeededPage ? "md:rounded-br-none rounded-br-none" : "")}>
                {children}
                <div className="absolute left-0 bottom-[5px] z-10 pl-[14px] md:pl-[20px] lg:pl-[32px] 2xl:pl-[40px] text-[10px]">
                    {
                        env.NODE_ENV == "development"
                        &&
                        <div className="text-rose-600 font-bold">
                            Runned on DEV
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}

export default HeaderBase;

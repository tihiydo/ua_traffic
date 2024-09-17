"use client"

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {}

const CookieMessage = (props: Props) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const item = localStorage.getItem('viewedFirstly')
        if (item === null) {
            localStorage.setItem('viewedFirstly', "no")
            setShow(true);
        }

    }, [])

    const CookieComponent = () => {
        // bg-[#3a3a3ad4] 
        return (
            show && <div className="flex flex-col sm:flex-row z-50 fixed bottom-0 w-full min-h-[6rem] bg-[#3a3a3ae5]  text-white px-5 py-4 rounded-t-xl text-sm backdrop-blur-[1px]">
                <X color="#ffffff" size={"20px"} className="absolute top-1 right-[15px] cursor-pointer" onClick={() => setShow(false)} />
                <div className="lg:w-[75%] md:w-[70%] sm:w-[60%] sm:mt-0 mt-2 font-medium"><Translate namespace="Cookies" itemKey="description" /></div>
                <div className="flex flex-col gap-y-2 items-center text-black lg:w-[25%] md:w-[30%] sm:w-[40%] sm:mt-0 mt-4">
                    <Button size={"sm"} onClick={() => setShow(false)} className="sm:w-[14rem] md:w-[12rem] w-full"><Translate namespace="Cookies" itemKey="yes" /></Button>
                    <Button onClick={() => {
                        if (typeof window === 'undefined') return;
                        setShow(false)
                        window.close()
                    }} variant={"outline"} size={"sm"} className="bg-[#d7d7d7] hover:bg-[#d7d7d7d4] font-bold sm:w-[14rem] md:w-[12rem] w-full sm:px-4 px-0"><Translate namespace="Cookies" itemKey="no" /></Button>
                </div>
            </div>)
    }

    return <CookieComponent />;
}

export default CookieMessage
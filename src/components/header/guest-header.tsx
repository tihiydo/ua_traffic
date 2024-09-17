'use client'

import { Link } from '@/i18n/navigation'
import React from 'react'
import { LanguageSelector } from '../language-selector'
import HeaderBase from './header-base'
import BurgerDrawer from './burger-drawer'
import { navLinksGuest } from '@/constants/nav-links'
import MainNavLink from '../ui/custom/main-nav-link'
import { NavLink } from '@/routes'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { DoorOpen, GalleryHorizontalEnd, Languages, BookOpenText, UserPlus } from 'lucide-react'
import Translate from '../Translate'
import LanguageSelectorOriginal from '../language-selector/language-selector-original'

const GuestHeader = () => {
    return (
        <HeaderBase>
            <div className='flex justify-between items-center gap-5'>
                <Link href={'/'} className={`font-kankin text-3xl text-white`}>
                    UATRAFFIC
                </Link>


                {/* Desktop view */}
                <div className='hidden gap-5 items-center md:flex ml-[50px]'>
                    <ul className="flex items-center gap-4">
                        {
                            navLinksGuest.map(route => (
                                <NavLink key={route.link} route={route}>
                                    {({ isActive }) => {
                                        return <MainNavLink isActive={isActive} {...route} />
                                    }}
                                </NavLink>
                            ))
                        }
                    </ul>

                    <div>
                        <LanguageSelector />
                    </div>
                </div>


                {/* Modile view */}
                <div className='block md:hidden'>
                    <BurgerDrawer>
                        <div className='text-main'>
                            <div>
                                <h2>
                                    <Link href={'/'} className={`text-3xl uppercase font-kankin mb-2`}>
                                        <span className='text-yellow'>U</span>
                                        <span className='text-[#2f6ed3]'>A</span>
                                        TRAFFIC
                                    </Link>
                                </h2>
                                <p className='text-xs sm:text-sm'>
                                    <Translate namespace="Header" itemKey="logo-descr" />
                                </p>

                                <div className="w-full h-3 my-5 flex">
                                    <div className="w-1/2 h-full bg-[#2f6ed3]"></div>
                                    <div className="w-1/2 h-full bg-yellow"></div>
                                </div>
                            </div>
                            
                            <div>
                                <ScrollArea className='leading-4 text-[0.80rem]'>
                                    <div className="h-full hover:bg-yellow/80 p-[8px] rounded-md"><Link href="/catalog" className="flex items-center gap-x-[22px]"><GalleryHorizontalEnd  size={16} strokeWidth={1} /><Translate namespace="Catalogue" itemKey="title" /></Link></div>
                                    <div className="h-full hover:bg-yellow/80 p-[8px] rounded-md"><Link href="/blog" className="flex items-center gap-x-[22px]"><BookOpenText size={16} strokeWidth={1} /><Translate namespace="Blog" itemKey="navname" /></Link></div>

                                    <Separator className="my-2" />
                                    <div className="h-full hover:bg-yellow/80 p-[8px] rounded-md"><Link href="/login" className="flex items-center gap-x-[22px]"><DoorOpen size={16} strokeWidth={1} /><Translate namespace="Nav-Links" itemKey="sign-in" /></Link></div>
                                    <div className="h-full hover:bg-yellow/80 p-[8px] rounded-md"><Link href="/sign-up" className="flex items-center gap-x-[22px]"><UserPlus size={16} strokeWidth={1} /><Translate namespace="Nav-Links" itemKey="sign-up" /></Link></div>
                                    <Separator className="my-2" />
                                    <div className="h-full flex place-content-between items-center p-[8px]">
                                        <div className="cursor-default flex items-center gap-x-[22px]"><Languages size={16} strokeWidth={1} /><Translate namespace="Header" itemKey="language" /></div>
                                        <div><LanguageSelectorOriginal/></div>
                                    </div>
                                </ScrollArea>
                            </div>
                               
                        </div >
                    </BurgerDrawer >
                </div>
            </div>
        </HeaderBase >
    )
}

export default GuestHeader
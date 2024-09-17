'use client'

import HeaderBase from './header-base'
import BurgerDrawer from './burger-drawer'
import { navLinksClient } from '@/constants/nav-links'
import MainNavLink from '../ui/custom/main-nav-link'
import { LanguageSelector } from '../language-selector'
import { Link } from '@/i18n/navigation'
import { BookOpenText, DoorOpen, GalleryHorizontalEnd, Gem, Languages, LogOut, UserCircle, UserCog, UserPlus, Wallet } from 'lucide-react'
import Translate from '../Translate'
import { api } from '@/trpc/react'
import { DepositModal } from '../forms/deposit-form'
import { Notifications } from '@/modules/notifications'
import { NavLink } from '@/routes'
import { signOut } from 'next-auth/react'
import { useGuideStore } from '@/modules/guide'
import { twMerge } from 'tailwind-merge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '../ui/separator'
import { usePathname, useRouter } from 'next/navigation'
import ClientHeaderTabs from './client-header-tabs'
import { ScrollArea } from '../ui/scroll-area'
import ClientHeaderMobileTabs from './client-header-mobile-tabs'
import LanguageSelectorOriginal from '../language-selector/language-selector-original'
import { useState } from 'react'

const ClientHeader = () => {
    const { push } = useRouter();
    const { data: isBanned, isLoading } = api.user.getBlockedOrNo.useQuery()
    const { data: user } = api.user.getMyUser.useQuery();
    const { data, isSuccess } = api.user.getClientHeaderTab.useQuery()
    const startGuide = useGuideStore(state => state.openGuide)
    const [poppoverIsOpen, setPoppoverOpen] = useState<boolean>(false)
    const pathname = usePathname();
    const cabinet: string = data == "Advertiser" ? '/advertiser' : '/blogger'

    if (!isLoading) {
        if (isBanned === true) {
            push("/blocked")
        } else if (isBanned === null) {
            signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })
        }
    }

    return (
        <HeaderBase>
            {/* DEKSTOP */}
            <div className={`bg-main flex items-center relative justify-between rounded-xl w-full`}>
                <Link href={'/'} className={`font-kankin text-3xl text-white pt-[5px] `}>
                    UATRAFFIC
                </Link>

                <div className={twMerge(`hidden lg:block w-full ml-[50px]`)}>
                    <ul className="flex items-center gap-x-[25px]">
                        {navLinksClient.map(route => (
                            <NavLink key={route.link} route={route}>
                                {({ isActive }) => {
                                    if (isSuccess && data == "Advertiser" && route.base != "/blogger") {
                                        return <MainNavLink isActive={isActive} {...route} />
                                    } else if (isSuccess && data == "Blogger" && route.base != "/advertiser") {
                                        return <MainNavLink isActive={isActive} {...route} />
                                    }
                                }}
                            </NavLink>
                        ))}
                    </ul>
                </div>

                <div className={twMerge('items-center hidden lg:flex gap-2')}>
                    <ClientHeaderTabs className='mr-5' />
                    <div>
                        <LanguageSelector />
                    </div>
                    <div>
                        <Notifications />
                    </div>
                    <div className='flex xl:gap-5 gap-3 items-center'>
                        <Popover open={poppoverIsOpen} onOpenChange={(d) => setPoppoverOpen(d)}>
                            <PopoverTrigger>
                                <div className="text-white duration-200 hover:text-yellow" id="profilePopover">
                                    <UserCircle size={30} strokeWidth={2} />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[14rem] text-sm mt-7">
                                <div className="h-full hover:bg-yellow/80 p-[8px] rounded-md">
                                    <Link href="/profile" onClick={async () => {
                                        setPoppoverOpen(false)
                                    }} className="flex items-center gap-x-[22px]">
                                        <UserCog size={18} strokeWidth={1} /><Translate namespace="Header" itemKey="profile" />
                                    </Link>
                                </div>
                                <Separator className="my-2" />
                                <div className="h-full flex place-content-between items-center p-[8px] rounded-md cursor-default">
                                    <div className="flex items-center gap-x-[22px]"><Gem size={18} strokeWidth={1} /><Translate namespace='Profile' itemKey='balance' /></div>
                                    <div className="text-xs">{user?.advertiserBalance ?? 0} <Translate namespace='Profile' itemKey='money' /></div>
                                </div>

                                <DepositModal>
                                    <div className="cursor-pointer h-full hover:bg-yellow/80 p-[8px] rounded-md flex items-center gap-x-[22px]">
                                        <Wallet size={18} strokeWidth={1} /><Translate namespace="Header" itemKey="addmoney" />
                                    </div>
                                </DepositModal>

                                <Separator className="my-2" />
                                <button
                                    disabled={['/catalog', '/advertiser', '/blogger'].every((path => !pathname.startsWith(path)))}
                                    className="w-full cursor-pointer h-full hover:bg-yellow/80 p-2 rounded-md flex items-center gap-x-[22px] disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-secondary/20"
                                    onClick={async () => {
                                        startGuide()
                                    }}
                                >
                                    <BookOpenText size={16} strokeWidth={1} /><Translate namespace="guide" itemKey="title" />
                                </button>

                                <Separator className="my-2" />
                                <div className="h-full hover:bg-yellow/80 p-[8px] rounded-md">
                                    <Link href="/profile/referral" className="flex items-center gap-x-[22px]">
                                        <UserPlus size={20} strokeWidth={1} /><Translate namespace="Profile.Referral" itemKey="navname" />
                                    </Link>
                                </div>
                                <Separator className="my-2" />

                                <div className="cursor-pointer h-full hover:bg-yellow/80 w-full p-[8px] rounded-md flex items-center gap-x-[22px]" onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })}>
                                    <LogOut size={18} strokeWidth={1} onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })} />
                                    <Translate namespace='Profile' itemKey='exit' />
                                </div>

                            </PopoverContent>
                        </Popover>
                    </div>

                </div>

                {/* MOBILE */}
                <div className={twMerge('flex lg:hidden')}> 
                    <div>
                        <Notifications />
                    </div>
                    <BurgerDrawer>
                        <div className='text-main'>
                            <div>
                                <h2>
                                    <Link href={'/'} className={`text-3xl uppercase font-kankin mb-2`}>
                                        UATRAFFIC
                                    </Link>
                                </h2>
                                <p className='text-xs sm:text-sm'>
                                    <Translate namespace="Header" itemKey="logo-descr" />
                                </p>

                                <div className="w-full h-3 my-5 flex">
                                    <div className="w-1/2 h-full bg-yellow"></div>
                                    <div className="w-1/2 h-full bg-[#2f6ed3]"></div>
                                </div>
                            </div>

                            <div>
                                <ClientHeaderMobileTabs className='mb-3' />
                                <Separator className="my-2" />

                                <ScrollArea className='leading-4 text-[0.80rem]'>
                                    <div className={twMerge("h-full hover:bg-yellow/80 p-[8px] rounded-md my-[3px]", pathname.startsWith("/catalog") && "bg-yellow/60")}><Link href="/catalog" className="flex items-center gap-x-[22px]"><GalleryHorizontalEnd size={18} strokeWidth={1} /><Translate namespace="Catalogue" itemKey="title" /></Link></div>
                                    <div className={twMerge("h-full hover:bg-yellow/80 p-[8px] rounded-md my-[3px]", pathname.startsWith("/blog") && "bg-yellow/60")}><Link href="/blog" className="flex items-center gap-x-[22px]"><BookOpenText size={18} strokeWidth={1} /><Translate namespace="Blog" itemKey="navname" /></Link></div> 
                                    <div className={twMerge("h-full hover:bg-yellow/80 p-[8px] rounded-md my-[3px]", pathname.startsWith(cabinet) ? "bg-yellow/60" : "")}><Link href={`${data == "Advertiser" ? '/advertiser/dashboard' : '/blogger'}`} className="flex items-center gap-x-[22px]"><DoorOpen size={18} strokeWidth={1} /><Translate namespace="Default" itemKey="cabinet" /></Link></div>
                                    <Separator className="my-2" />
                                    <div className={twMerge("h-full hover:bg-yellow/80 p-[8px] rounded-md my-[3px]", pathname.startsWith("/profile") && "bg-yellow/60")}><Link href="/profile" className="flex items-center gap-x-[22px]"><UserCog size={18} strokeWidth={1} /><Translate namespace="Header" itemKey="profile" /></Link></div>
                                    <Separator className="my-2" />
                        
                                    <div className="h-full flex place-content-between items-center p-[8px] rounded-md cursor-default my-[3px]">
                                        <div className="flex items-center gap-x-[22px]"><Gem size={18} strokeWidth={1} /><Translate namespace='Profile' itemKey='balance' /></div>
                                        <div className="text-xs">{user?.advertiserBalance ?? 0} <Translate namespace='Profile' itemKey='money' /></div>
                                    </div>

                                    <DepositModal>
                                        <div className="cursor-pointer h-full hover:bg-yellow/80 p-[8px] rounded-md flex items-center gap-x-[22px] my-[3px]">
                                            <Wallet size={18} strokeWidth={1} /><Translate namespace="Header" itemKey="addmoney" />
                                        </div>
                                    </DepositModal>

                                    <div className="h-full flex place-content-between items-center p-[8px] my-[3px]">
                                        <div className="cursor-default flex items-center gap-x-[22px]"><Languages size={18} strokeWidth={1} /><Translate namespace="Header" itemKey="language" /></div>
                                        <div><LanguageSelectorOriginal /></div>
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="my-[3px] cursor-pointer h-full hover:bg-yellow/80 w-full p-[8px] rounded-md flex items-center gap-x-[22px]" onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })}>
                                        <LogOut size={18} strokeWidth={1} onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })} />
                                        <Translate namespace='Profile' itemKey='exit' />
                                    </div>
                                </ScrollArea >
                            </div>

                        </div >
                    </BurgerDrawer >
                </div >
            </div >
        </HeaderBase >
    )
}

export default ClientHeader

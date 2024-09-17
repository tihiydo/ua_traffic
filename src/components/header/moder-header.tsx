'use client'

import MainNavLink from '@/components/ui/custom/main-nav-link'
import { navLinksModer } from '@/constants/nav-links'
import React from 'react'
import HeaderBase from './header-base'
import BurgerDrawer from './burger-drawer'
import { Link } from '@/i18n/navigation'
import { NavLink } from '@/routes'
import { signOut } from 'next-auth/react'
import { LogOutIcon } from 'lucide-react'

const AdminHeader = () => {
    return (
        <HeaderBase>
            <div className={`flex items-center relative justify-between `}>
                <Link href={'/'} className={`font-kankin text-3xl text-white`}>UATRAFFIC</Link>

                {/* Desktop view */}
                <div className={`items-center  hidden lg:flex`}>
                    <div className="mr-8">
                        <ul className="flex items-center gap-4">
                            {navLinksModer.map(route => (
                                <NavLink route={route} key={route.link}>
                                    {({ isActive }) => (
                                        <MainNavLink  {...route} isActive={isActive} />
                                    )}
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => {
                            signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + "/admin-login" })
                        }}
                        className="text-white duration-100 hover:text-yellow"
                    >
                        <LogOutIcon size={30} />
                    </button>
                </div>

                {/* Mobile view */}
                <div className='flex lg:hidden'>
                    <div className='flex items-center'>
                        <button
                            onClick={() => {
                                signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + "/admin-login" })
                            }}
                            className="text-white duration-100 hover:text-yellow"
                        >
                            <LogOutIcon size={30} />
                        </button>
                    </div>
                    <BurgerDrawer>
                        бургер
                    </BurgerDrawer>
                </div>
            </div>
        </HeaderBase>
    )
}

export default AdminHeader
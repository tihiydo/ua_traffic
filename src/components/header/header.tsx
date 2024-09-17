'use client'

import React from 'react'
import GuestHeader from './guest-header';
import ClientHeader from './client-header';
import { useSession } from 'next-auth/react';


const Header = () => {
    const session = useSession();

    if (!session.data?.user) {
        return <GuestHeader />
    }

    return <ClientHeader />
}

export default Header
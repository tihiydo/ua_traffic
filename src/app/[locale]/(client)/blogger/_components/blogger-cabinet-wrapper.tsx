'use client'

import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { usePathname } from '@/i18n/navigation';
import { api } from '@/trpc/react'
import React from 'react'
import { blockedPage } from './blogger-nav-bar';

interface Props {
    children: React.ReactNode;
}

const BloggerCabinetWrapper = ({ children }: Props) => {
    const pathname = usePathname();
    const page = pathname.split("/blogger/")[1] || ""
    const { data: hasOneChannel, isLoading } = api.blogger.haveOneChannel.useQuery()

    if (!blockedPage.includes(page)) {
        return <>
            {children}
        </>
    }

    if (isLoading) {
        return <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <SpinnerLoading size={50} />
        </div>
    }

    if (hasOneChannel) {
        return <>
            {children}
        </>
    }

    return null;
}

export default BloggerCabinetWrapper
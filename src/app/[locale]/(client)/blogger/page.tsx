"use client"

import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react'
import { useEffect } from 'react';

const BloggerPage = () => {
    const { push } = useRouter();

    const { data: hasOneChannel, isLoading } = api.blogger.haveOneChannel.useQuery()

    useEffect(() => {
        if (isLoading || typeof hasOneChannel === 'undefined') return;


        if (hasOneChannel) 
        {
            push('/blogger/dashboard')
        } 
        else
        {
            push('/blogger/new-channel')
        }

    }, [isLoading, hasOneChannel, push])


    return <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <SpinnerLoading size={50} />
    </div>
}

export default BloggerPage
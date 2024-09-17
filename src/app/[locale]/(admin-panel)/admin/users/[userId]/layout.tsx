"use client"

import PageTitle from '@/components/page-title'
import GoBackLink from '@/components/go-back-link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';

type Props = 
{
    children: React.ReactNode
    params:
    {
        userId: string
    }
}


const UserPreviewLayout = (props : Props) => 
{
    const path = usePathname()
    const pathParts = path.split("/")
    const isBloggerOrAdvertiserPage = pathParts[pathParts.length - 2] == "blogger" || pathParts[pathParts.length - 2] == "advertiser"

    return (
        <div className="container">
                {
                    isBloggerOrAdvertiserPage ?
                    <GoBackLink className="mb-8 mt-4" fallbackLink="/admin/users"/>
                    :
                    <GoBackLink className="mb-8 mt-4"/>
                }
                <div className={"mb-8 gap-3 flex"}>
                    <Link href={`/admin/users/${props.params.userId}/blogger/my-requests`}>
                        <div className={`cursor-pointer relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] ${path.includes("/blogger") ? 'after:w-full' : ''}`}>
                            <p className="font-title uppercase">Блогер</p>
                        </div>
                    </Link>
                    <Link href={`/admin/users/${props.params.userId}/advertiser/my-requests`}>
                        <div className={`cursor-pointer relative flex items-center gap-2 px-0.5 py-0.5 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:content-[''] ${path.includes("/advertiser") ? 'after:w-full' : ''}`}>

                            <p className="font-title uppercase">Рекламодавець</p>
                        </div>
                    </Link>
                </div>
            <div>{props.children}</div>
        </div>
    )
}

export default UserPreviewLayout

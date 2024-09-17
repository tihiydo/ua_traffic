"use client";
import InfoMessage from "@/components/ui/custom/info-message";
import { Link } from "@/i18n/navigation";
import { api } from "@/trpc/react";
import { Dispatch, SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePathname } from 'next/navigation'
import Translate from "@/components/Translate";

type Props = {
    className?: string;
    userId: string
};

type Route =
{
    link: string,
    name: React.ReactNode
}

const advertiserSubRoutes: Array<Route> = 
[
   {link: "my-requests", name: <Translate namespace="Advertiser" itemKey="mysposts" />},
   {link: "my-posts", name: <Translate namespace="Advertiser" itemKey="orders" />},
   {link: "billing", name: <Translate namespace="Advertiser" itemKey="billing" /> },
   {link: "chats", name: <Translate namespace="Advertiser" itemKey="chats" /> },
]

const AdvertiserNavBar = (props : Props) => 
{
    return (
        <>
            <nav className="flex">
                <ul className={twMerge("sm:overflow-x-hidden overflow-x-auto items-center rounded-lg border border-gray-secondary p-1 flex gap-2")}>
                    {advertiserSubRoutes.map((route) => (
                        <AdvertiserNavLink link={route.link} name={route.name} key={route.link} userId={props.userId}/>
                    ))}
                </ul>
            </nav>
        </>)
}

const AdvertiserNavLink = ({link, userId, name} : {link: string, userId: string, name: string | React.ReactNode}) => {
    const pathname = usePathname()
    return (
        <Link
            href={`/admin/users/${userId}/advertiser/${link}`}
            className={twMerge(
                "rounded-md px-3 py-1.5 whitespace-nowrap text-sm",
                pathname.includes(`/${link}`) ? "bg-yellow font-bold" : ""
            )}
        >
            {name}
        </Link >)
};

export default AdvertiserNavBar;
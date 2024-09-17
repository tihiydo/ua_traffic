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

const bloggerSubRoutes: Array<Route> = 
[
   {link: "my-requests", name: <Translate namespace="Blogger" itemKey="myorders" />},
   {link: "my-channels", name: <Translate namespace="Blogger" itemKey="mychannels" />},
   {link: "billing", name: <Translate namespace="Blogger" itemKey="profit" /> },
   {link: "chats", name: <Translate namespace="Blogger" itemKey="chats" /> },
]

const BloggerNavBar = (props : Props) => 
{
    return (
        <>
            <nav className="flex">
                <ul className={twMerge("sm:overflow-x-hidden overflow-x-auto items-center rounded-lg border border-gray-secondary p-1 flex gap-2")}>
                    {bloggerSubRoutes.map((route) => (
                        <BloggerNavLink link={route.link} name={route.name} key={route.link} userId={props.userId}/>
                    ))}
                </ul>
            </nav>
        </>)
}

const BloggerNavLink = ({link, userId, name} : {link: string, userId: string, name: string | React.ReactNode}) => {
    const pathname = usePathname()
    return (
        <Link
            href={`/admin/users/${userId}/blogger/${link}`}
            className={twMerge(
                "rounded-md px-3 py-1.5 whitespace-nowrap text-sm",
                pathname.includes(`/${link}`) ? "bg-yellow font-bold" : ""
            )}
        >
            {name}
        </Link >)
};

export default BloggerNavBar;
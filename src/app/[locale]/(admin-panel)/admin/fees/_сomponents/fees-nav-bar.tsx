"use client";
import { Link, usePathname } from "@/i18n/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: string;
};

type NavLink =
    {
        title: string;
        path: `/admin/fees/${string}`;
    };

const advertiserNavLinks: Array<NavLink> =
    [
        { path: "/admin/fees/deposit", title: "На депозит" },
        { path: "/admin/fees/withdrawn", title: "На виведення" },
        { path: "/admin/fees/bonus", title: "Реферальний бонус" },
        {path: "/admin/fees/transfer", title: "На переказ"}
    ];

const ModerationNavBar = ({ className }: Props) => 
{
    return (
        <nav className="flex">
            <ul className="flex sm:overflow-x-hidden overflow-x-auto items-center gap-2 rounded-lg border border-gray-secondary p-1">
                {advertiserNavLinks.map((navLink) => (
                    <ModerationNavLink key={navLink.path} {...navLink} />
                ))}
            </ul>
        </nav>
    );
};

const ModerationNavLink = ({ path, title }: NavLink) => {
    const pathname = usePathname();

    return (
        <Link
            href={path}
            className={twMerge(
                "rounded-md px-3 py-1.5",
                pathname.startsWith(path) ? "bg-yellow font-bold" : "",
            )}
        >
            {title}
        </Link>
    );
};

export default ModerationNavBar;

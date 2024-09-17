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
        path: `/moder/moderation${string}`;
    };

const advertiserNavLinks: Array<NavLink> =
    [
        { path: "/moder/moderation/bloggers", title: "Блогери" },
        { path: "/moder/moderation/advertisments", title: "Рекламні пости" },
        { path: "/moder/moderation/adv-requests", title: "Рекламні заявки" },
    ];

const ModerationNavBar = ({ className }: Props) => {
    return (
        <nav className="flex min-h-[50px]">
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
                "rounded-md px-[14px] py-[10px]",
                pathname.startsWith(path) ? "bg-yellow font-bold" : "",
            )}
        >
            {title}
        </Link>
    );
};

export default ModerationNavBar;

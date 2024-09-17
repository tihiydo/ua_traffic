'use client'

import { Link } from "@/i18n/navigation";
import { type Route } from "@/routes";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = Route & { isActive: boolean, className?: string };

const MainNavLink = ({ isActive, link, name, className }: Props) => {
    return (
        <li>
            <Link
                href={link}
                className={twMerge(
                    "text-[13px] uppercase min-w-[30px] whitespace-nowrap after:-b-5 relative font-title after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-white after:duration-200 after:content-[''] hover:after:w-full",
                    isActive &&
                    "text-yellow after:w-full after:bg-yellow",
                    className
                )}
            >
                {name}
            </Link>
        </li>
    );
};

export default MainNavLink;

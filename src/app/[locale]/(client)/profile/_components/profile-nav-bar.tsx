"use client";
import { Link } from "@/i18n/navigation";
import { NavLink, type Route, routes } from "@/routes";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: string;
};

const profileSubRoutes: Array<Route> = [
    routes.profile.subRoutes.profile,
    routes.profile.subRoutes.settings,
    routes.profile.subRoutes.referral,
    routes.profile.subRoutes.other
];

const ProfileNavBar = ({ }: Props) => {
    return (
        <nav className="flex min-h-[50px]">
            <ul className="flex sm:overflow-x-hidden overflow-x-auto items-center gap-2 rounded-lg border border-gray-secondary p-1">
                {profileSubRoutes.map((route) => (
                    <NavLink route={route} key={route.link}>
                        {({ isActive }) => (
                            <ProfileNavLink isActive={isActive} {...route} />
                        )}
                    </NavLink>
                ))}
            </ul>
        </nav>
    );
};

const ProfileNavLink = ({ isActive, link, name }: Route & { isActive: boolean }) => {
    return (
        <Link
            href={link}
            className={twMerge(
                "rounded-md px-[14px] py-[10px] whitespace-nowrap text-sm",
                isActive ? "bg-yellow font-bold" : "",
            )}
        >
            {name}
        </Link >
    );
};

export default ProfileNavBar;

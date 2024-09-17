'use client';

import { Link, usePathname } from "@/i18n/navigation";
import { type Route, routes } from "@/routes";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { type LucideIcon, User, Settings, Users, MoreHorizontal } from "lucide-react";
import CabinetColorPicker from '@/components/CabinetColorPicker';
import Translate from '@/components/Translate';
import TelegramSupportModal from '@/components/telegram-support-modal';

const profileSubRoutes: Array<Route & { icon: LucideIcon }> = [
    { ...routes.profile.subRoutes.profile, icon: User },
    { ...routes.profile.subRoutes.settings, icon: Settings },
    { ...routes.profile.subRoutes.referral, icon: Users },
    { ...routes.profile.subRoutes.other, icon: MoreHorizontal }
];

const ProfileSidebar = () => {
    const pathname = usePathname();

    const isActive = (link: string) => pathname === link;

    return (
        <aside className="w-80 h-screen bg-white border-r border-slate-300 overflow-y-auto flex flex-col">
            <div className="p-5 border-b border-slate-300 flex items-center">
                <div className="flex items-center space-x-4 h-[60px]">
                    <CabinetColorPicker cabinetType="profile" />
                    <h2 className="text-2xl font-bold">
                        <Translate namespace="Profile" itemKey="namespace" />
                    </h2>
                </div>
            </div>
            <nav className="flex-1 px-2 py-4">
                <ul className="space-y-4">
                    {profileSubRoutes.map((route) => (
                        <li key={route.link}>
                            <Link
                                href={route.link}
                                className={twMerge(
                                    "flex items-center p-2 h-[55px] rounded-lg",
                                    isActive(route.link) ? "bg-yellow text-black" : "text-black hover:bg-gray"
                                )}
                            >
                                <route.icon className="[30px] h-[30px] mr-[20px]" />
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-2 py-4">
                <div className="px-2 py-4">
                <TelegramSupportModal />
            </div>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
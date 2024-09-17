'use client';

import { Link, usePathname } from "@/i18n/navigation";
import { type Route, routes } from "@/routes";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { type LucideIcon, FileText, Folders, PlusCircle, Wallet, MessageCircle, LucideLayoutDashboard } from "lucide-react";
import CabinetColorPicker from '@/components/CabinetColorPicker';
import Translate from '@/components/Translate';
import TelegramSupportModal from '@/components/telegram-support-modal';


const advertiserRoutes = routes.advertiser.subRoutes;

const advertiserSubRoutes: Array<Route & { icon: LucideIcon }> = [
    { ...advertiserRoutes.dashboard, icon: LucideLayoutDashboard },
    { ...advertiserRoutes.myRequests, icon: FileText },
    { ...advertiserRoutes.myPosts, icon: Folders },
    { ...advertiserRoutes.newPost, icon: PlusCircle },
    { ...advertiserRoutes.billing, icon: Wallet },
    { ...advertiserRoutes.chats, icon: MessageCircle }
];

const AdvertiserSidebar = () => {
    const pathname = usePathname();

    const isActive = (link: string) => pathname === link;

    return (
        <aside className="w-80 h-screen bg-white border-r border-slate-300 overflow-y-auto flex flex-col">
            <div className="p-5 border-b border-slate-300 flex items-center">
                <div className="flex items-center space-x-4 h-[60px]">
                    <CabinetColorPicker cabinetType="advertiser" />
                    <h2 className="text-2xl font-bold">
                        <Translate namespace="Advertiser" itemKey="navname" />
                    </h2>
                </div>
            </div>
            <nav className="flex-1 px-2 py-4">
                <ul className="space-y-4">
                    {advertiserSubRoutes.map((route) => (
                        <li key={route.link}>
                            <Link
                                href={route.link}
                                className={twMerge(
                                    "flex items-center p-2 h-[55px] rounded-lg",
                                    isActive(route.link) ? "bg-yellow text-black" : "text-black hover:bg-gray"
                                )}
                            >
                                <route.icon className="w-[30px] h-[30px] mr-[20px]" />
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-2 py-4">
                <TelegramSupportModal />
            </div>
        </aside>
    );
};

export default AdvertiserSidebar;
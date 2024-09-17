'use client';

import { Link, usePathname } from "@/i18n/navigation";
import { type Route, routes } from "@/routes";
import { api } from "@/trpc/react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { type LucideIcon, LayoutDashboard, FileText, Folders, PlusCircle, Wallet, MessageCircle } from "lucide-react";
import CabinetColorPicker from '@/components/CabinetColorPicker';
import Translate from '@/components/Translate';
import TelegramSupportModal from '@/components/telegram-support-modal';


const bloggerRoute = routes.blogger!;

const bloggerSubRoutes: Array<Route & { icon: LucideIcon }> = [
    { ...bloggerRoute.subRoutes.dashboard, icon: LayoutDashboard },
    { ...bloggerRoute.subRoutes.myRequests, icon: FileText },
    { ...bloggerRoute.subRoutes.myChannels, icon: Folders },
    { ...bloggerRoute.subRoutes.newChannel, icon: PlusCircle },
    { ...bloggerRoute.subRoutes.billing, icon: Wallet },
    { ...bloggerRoute.subRoutes.chats, icon: MessageCircle }
];

export const blockedPage = ['my-requests', 'my-channels', 'billing', 'chats', 'dashboard'];

const BloggerSidebar = () => {
    const pathname = usePathname();
    const { data: haveAccess = false, isLoading } = api.blogger.haveOneChannel.useQuery();

    const isActive = (link: string) => pathname === link;

    return (
        <aside className="w-80 h-screen bg-white border-r border-slate-300 overflow-y-auto flex flex-col">
            <div className="p-5 border-b border-slate-300 flex items-center">
                <div className="flex items-center space-x-4 h-[60px]">
                    <CabinetColorPicker cabinetType="blogger" />
                    <h2 className="text-2xl font-bold">
                        <Translate namespace="Blogger" itemKey="navname" />
                    </h2>
                </div>
            </div>
            <nav className="flex-1 px-2 py-4">
                <ul className="space-y-4">
                    {bloggerSubRoutes.map((route) => (
                        <li key={route.link}>
                            <Link
                                href={route.link}
                                className={twMerge(
                                    "flex items-center p-2 h-[55px] rounded-lg",
                                    isActive(route.link) ? "bg-yellow text-black" : "text-black hover:bg-gray",
                                    (!haveAccess && blockedPage.includes(route.link.split("/blogger/")[1] || "")) ? " cursor-not-allowed text-slate-500" : ""
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

export default BloggerSidebar;
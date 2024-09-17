'use client';

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { type Route, routes, NavLink } from "@/routes";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import BlockWarn from "../../_components/block-warn";
import { GuideHint, GuideHintWrapper, useGuideOpened, TASK_ID } from "@/modules/guide";

type Props = {
    className?: string;
};

const bloggerRoute = routes.blogger!;

const bloggerSubRoutes: Array<Route> = [
    bloggerRoute.subRoutes.dashboard,
    bloggerRoute.subRoutes.myRequests,
    bloggerRoute.subRoutes.myChannels,
    bloggerRoute.subRoutes.newChannel,
    bloggerRoute.subRoutes.billing,
    bloggerRoute.subRoutes.chats
];

export const blockedPage = ['my-requests', 'my-channels', 'billing', 'chats', 'dashboard'];

const BloggerNavBar = ({ }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const page = pathname.split("/blogger/")[1] || "";
    const { data: haveAccess = false, isLoading } = api.blogger.haveOneChannel.useQuery();
    const guideOpened = useGuideOpened();


    useEffect(() => {
        if (isLoading) return;

        if (!haveAccess && blockedPage.includes(page)) {
            router.replace('/blogger/new-channel');
        }
    }, [page, blockedPage, haveAccess, isLoading, router]);

    if (!haveAccess && !isLoading) {
        if (blockedPage.includes(page)) {
            return (<BlockWarn />);
        }
    }

    return (
        <nav className="" id="navbar-blogger">
            <div className={twMerge(
                "flex lg:hidden mb-4 overflow-x-auto whitespace-nowrap items-center gap-2 rounded-lg border border-gray-300 p-2",
                guideOpened ? "overflow-x-visible" : ""
            )}>
                {bloggerSubRoutes.map((route) => (
                    <NavLink key={route.link} route={route}>
                        {({ isActive }: { isActive: boolean }) => {
                            const currentPage = route.link.split("/blogger/")[1] || "";
                            const isBlocked = haveAccess ? false : blockedPage.includes(currentPage);
                            return (
                                <BloggerNavLink
                                    {...route}
                                    isActive={isActive}
                                    isBlocked={isBlocked}
                                    haveAccess={haveAccess || false}
                                />
                            );
                        }}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

type BloggerNavLinkProps = Route & {
    isActive: boolean;
    isBlocked: boolean;
    haveAccess: boolean;
};

const BloggerNavLink = ({ isActive, link, name, isBlocked, haveAccess }: BloggerNavLinkProps) => {
    const content = isBlocked ? (
        <div className={twMerge("rounded-md px-3 py-2 text-sm cursor-not-allowed text-gray-400")}>
            {name}
        </div>
    ) : (
        <Link
            href={link}
            className={twMerge(
                "rounded-md px-3 py-2 text-sm",
                isActive ? "bg-yellow text-black" : "text-slate-300 hover:bg-gray",
                haveAccess ? "text-black" : "mx-1",
                // isBlocked ? "text-gray" : ""
            )}
        >
            {name}
        </Link>
    );

    if (link === routes.blogger.subRoutes.newChannel.link) {
        return (
            <GuideHintWrapper taskId={TASK_ID.BLOGGER.FIRST_CHANNEL} className="rounded-sm">
                {content}
                <GuideHint />
            </GuideHintWrapper>
        );
    }

    if (link === routes.blogger.subRoutes.myChannels.link) {
        return (
            <GuideHintWrapper taskId={TASK_ID.BLOGGER.CHANNEL_STATUS} className="rounded-sm">
                {content}
                <GuideHint />
            </GuideHintWrapper>
        );
    }

    if (link === routes.blogger.subRoutes.myRequests.link) {
        return (
            <GuideHintWrapper taskId={TASK_ID.BLOGGER.FIRST_REQUEST} className="rounded-sm">
                {content}
                <GuideHint className="translate-x-0 left-0" />
            </GuideHintWrapper>
        );
    }

    return content;
};

export default BloggerNavBar;
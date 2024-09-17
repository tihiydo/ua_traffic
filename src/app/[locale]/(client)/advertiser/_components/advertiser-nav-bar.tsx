"use client";
import { Link, useRouter } from "@/i18n/navigation";
import { type Route, routes, NavLink } from "@/routes";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { GuideHint, GuideHintWrapper, useGuideOpened, TASK_ID } from "@/modules/guide";

type Props = {
    className?: string;
};

const advertiserRoutes = routes.advertiser.subRoutes;

const advertiserSubRoutes: Array<Route> = [
    advertiserRoutes.dashboard,
    advertiserRoutes.myRequests,
    advertiserRoutes.myPosts,
    advertiserRoutes.newPost,
    advertiserRoutes.billing,
    advertiserRoutes.chats
]

const AdvertiserNavBar = ({ }: Props) => {
    const guideOpened = useGuideOpened();

    return (
        <nav className="flex min-h-[50px]">
            <ul className={twMerge("flex sm:overflow-x-hidden overflow-x-auto items-center gap-2 rounded-lg border border-gray-secondary p-1", guideOpened ? "sm:overflow-x-visible overflow-x-visible" : "")} id="avertiser-navbar">
                {advertiserSubRoutes.map((route) => (
                    <NavLink key={route.link} route={route}>
                        {({ isActive }) => (
                            <AdvertiserNavLink  {...route} isActive={isActive} />
                        )}
                    </NavLink>
                ))}
            </ul>
        </nav>
    );
};

const AdvertiserNavLink = ({ isActive, link, name }: Route & { isActive: boolean }) => {
    const { data: user } = api.user.getMyUser.useQuery()
    const { push } = useRouter();
    const t = useTranslations();

    if (link == routes.advertiser.subRoutes.newPost.link) {
        return (
            <GuideHintWrapper taskId={TASK_ID.ADVERTISER.FIRST_AD} className={'rounded-sm'}>
                <Link
                    href={link}
                    className={twMerge(
                        "rounded-md px-[14px] py-[10px] whitespace-nowrap text-sm",
                        isActive ? "bg-yellow font-bold" : "",
                    )}
                >
                    {name}
                </Link>

                <GuideHint />
            </GuideHintWrapper>
        );
    }

    if (link == routes.advertiser.subRoutes.billing.link) {
        return (
            <GuideHintWrapper taskId={TASK_ID.ADVERTISER.DEPOSIT} className={'rounded-sm'}>
                <Link
                    href={link}
                    className={twMerge(
                        "rounded-md px-[14px] py-[10px] whitespace-nowrap text-sm",
                        isActive ? "bg-yellow font-bold" : "",
                    )}
                >
                    {name}
                </Link>

                <GuideHint />
            </GuideHintWrapper >
        )
    }

    if (link == routes.advertiser.subRoutes.myRequests.link) {
        return (
            <GuideHintWrapper taskId={TASK_ID.ADVERTISER.CHECK_STATUS} className={'rounded-sm'}>
                <Link
                    href={link}
                    className={twMerge(
                        "rounded-md px-[14px] py-[10px] whitespace-nowrap text-sm",
                        isActive ? "bg-yellow font-bold" : "",
                    )}
                >
                    {name}
                </Link>

                <GuideHint className="translate-x-0 left-0" />
            </GuideHintWrapper >
        )
    }


    return (
        <Link
            href={link}
            className={twMerge(
                "rounded-md px-[14px] py-[10px] whitespace-nowrap text-sm",
                isActive ? "bg-yellow font-bold" : "",
            )}
        >
            {name}
        </Link>
    );

};

export default AdvertiserNavBar;

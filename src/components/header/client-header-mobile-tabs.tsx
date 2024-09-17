"use client";

import { useRouter } from "@/i18n/navigation";
import { api } from "@/trpc/react";
import { twMerge } from "tailwind-merge";
import { type Cabinet } from "@prisma/client";
import React from "react";
import Translate from "../Translate";

type Props = {
    className?: string;
};

type NavLink = {
    type: Cabinet;
    title: React.ReactNode;
};

const ClientHeaderMobileTabsLinks: Array<NavLink> = [
    { type: "Advertiser", title: <Translate namespace="Default" itemKey="advertiser" /> },
    { type: "Blogger", title: <Translate namespace="Default" itemKey="blogger" /> },
];

const ClientHeaderMobileTabs = ({ className }: Props) => {
    return (
        <nav className={twMerge("flex place-content-center w-fit mx-auto", className)}>
            <ul className="flex items-center gap-[5px] rounded-lg border border-gray-secondary p-1.5 w-full overflow-x-auto no-scrollbar">
                {ClientHeaderMobileTabsLinks.map((tabLink) => (
                    <ClientTabLink key={tabLink.type} {...tabLink} />
                ))}
            </ul>
        </nav>
    );
};

const ClientTabLink = ({ type, title }: NavLink) => {
    const { data, isSuccess } = api.user.getClientHeaderTab.useQuery()

    const utils = api.useUtils();
    //const [cabinet, setCabinet] = useState<Cabinet>()
    const { push } = useRouter();

    const { mutateAsync: mutate } = api.user.changeClientHeaderTab.useMutation({
        onSuccess: (response) => {
            if (response == "Advertiser") {
                push("/advertiser/dashboard")
            } else if (response == "Blogger") {
                push("/blogger")
            }

            utils.user.getClientHeaderTab.setData(undefined, () => {
                return response
            })
        }
    })

    return (
        <button
            onClick={async () => {
                mutate({ cabinet: type })
            }}
            className={twMerge(
                "cursor-pointer h-full flex items-center justify-center rounded-md px-[10px] py-[6px] text-[0.72rem] lg:text-[0.67rem] leading-4 mx-[5px] lg:mx-[0px] w-[50%] lg:w-fit min-w-min text-center",
                isSuccess && data == type ? "bg-yellow font-bold" : "",
            )}
        >
            {title}
        </button>
    );
};

export default ClientHeaderMobileTabs;

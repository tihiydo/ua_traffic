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

const ClientHeaderTabsLinks: Array<NavLink> = [
    { type: "Advertiser", title: <Translate namespace="Default" itemKey="advertiser" /> },
    { type: "Blogger", title: <Translate namespace="Default" itemKey="blogger" /> },
];

const ClientHeaderTabs = ({ className }: Props) => {
    return (
        <nav className={twMerge("flex place-content-center ", className)}>
            <ul className="flex  items-center gap-[5px] overflow-auto bg-gray-secondary/50 rounded-md  p-1.5 w-full ">
                {ClientHeaderTabsLinks.map((tabLink) => (
                    <ClientTabLink key={tabLink.type} {...tabLink} />
                ))}
            </ul>
        </nav>
    );
};

const ClientTabLink = ({ type, title }: NavLink) => {
    const { data: activeCabinet, isSuccess } = api.user.getClientHeaderTab.useQuery()
    const isActive = activeCabinet === type

    const utils = api.useUtils();
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
                "cursor-pointer h-full flex items-center justify-center rounded-md font-bold px-2.5 py-1.5 text-sm leading-4 mx-[5px] lg:mx-[0px] w-[50%] lg:w-fit text-gray min-w-min text-center hover:bg-gray/40 transition-colors",
                isSuccess && isActive ? "bg-gray/80  text-main pointer-events-none" : "",
            )}
        >
            {title}
        </button>
    );
};

export default ClientHeaderTabs;

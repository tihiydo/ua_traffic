"use client"

import React, { useEffect } from "react";
import { Footer } from "../_components/footer";
import { Header } from "@/components/header";
import { twMerge } from "tailwind-merge";
import { api } from "@/trpc/react";
import { Guide, useGuideOpened } from "@/modules/guide";


type Props = {
    children: React.ReactNode;
    params: { locale: string }
};

type refItem =
    {
        inviterUserId: string
        date: string
    }

const PublicLayout = ({ children }: Props) => {
    const { mutate, } = api.user.setRefferal.useMutation({
        onSuccess: (resp) => {
            if (resp !== false) {
                localStorage.removeItem("refItem")
            }
        }
    })

    const guideOpened = useGuideOpened();

    useEffect(() => {
        const refLS = localStorage.getItem("refItem")
        if (refLS != null) {
            const { inviterUserId, date } = JSON.parse(refLS) as refItem
            mutate({ inviterId: inviterUserId, datetime: date })
        }
    }, [])

    return (
        <div>
            <div className={twMerge("flex flex-col min-h-screen h-full")}>
                <Header />

                <div className={twMerge("container h-full flex-1 mb-4", guideOpened ? "pr-0 flex gap-x-[15px]" : "")}>
                    <main className={twMerge("h-full flex-1 min-h-screen", guideOpened ? "flex-1" : "")}>
                        {children}
                    </main>

                    {guideOpened && <Guide />}
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default PublicLayout;

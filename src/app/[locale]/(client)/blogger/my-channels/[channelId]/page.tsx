'use client'

import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import InstagramBloggerEditForm from "./_components/blogger-edit-forms/instagram-blogger-edit-form";
import TelegramBloggerEditForm from "./_components/blogger-edit-forms/telegram-blogger-edit-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import DeclinedMessage from "./_components/decline-message";
import { type SocialType } from "@prisma/client";
import GoBackLink from "@/components/go-back-link";
import { type IGBlogger, type TGChannel } from "@/database/blogger";

type Props = {
    params: {
        channelId: string;
    };
};

function MyChannelPage({ params }: Props) {
    const { replace } = useRouter();
    const { data: blogger, error } = api.blogger.getBlogger.useQuery({
        bloggerId: params.channelId,
    });

    useEffect(() => {
        if (!error) return;

        replace('/blogger/my-channels')
        toast.error(error.message)
    }, [error])

    const edistFormsMap: Record<SocialType, React.ReactNode> = {
        Instagram: <InstagramBloggerEditForm channel={blogger as IGBlogger} />,
        Telegram: <TelegramBloggerEditForm channel={blogger as TGChannel} />
    }

    if (!blogger) {
        return;
    }


    return <div className="flex flex-col w-[600px]">
        <GoBackLink fallbackLink="/blogger/my-channels" className="mb-3" />
        {(blogger.declinedMessage && blogger.status === 'Declined') ? (
            <div className="mb-5">

                <DeclinedMessage message={blogger.declinedMessage} />
            </div>
        ) : null}

        {edistFormsMap[blogger.type]}
    </div>;
}

export default MyChannelPage;

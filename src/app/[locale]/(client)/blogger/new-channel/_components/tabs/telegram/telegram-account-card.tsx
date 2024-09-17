'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AskAction from "@/components/ui/custom/ask-action";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "react-toastify";

type Props = {
    image: string;
    username: string | null;
    followersCount: number | null;

};

const TelegramAccountCard = ({
    image,
    followersCount,
    username,
}: Props) => {
    const utils = api.useUtils();
    const t = useTranslations("Blogger");
    const deleteMyVerifRequest = api.telegram.deleteMyVerifRequest.useMutation({
        onSettled: () =>
        {
            utils.telegram.getMyTelegramProfile.refetch()
        }
    })

    return (
        <Card className=" w-full px-4 py-3">
            <div className="flex flex-row items-center gap-x-4">
                <BloggerAvatar className="min-h-16 min-w-16" src={image} />

                <div className="flex flex-row w-full justify-between">
                    <div>
                        <div className="font-bold">@{username}</div>
                        <div className="text-sm">
                            {followersCount} {t("followersby")}
                        </div>
                    </div>

                    <AskAction onAccept={async () =>
                    {
                        await deleteMyVerifRequest.mutateAsync()
                    }}>
                        <Button
                            disabled={deleteMyVerifRequest.isLoading}
                            variant={'ghost'}
                            size={'icon'}
                            type="button"
                            className="group/tg-delete-btn w-fit h-fit p-2"
                            >
                            {deleteMyVerifRequest.isLoading ? (
                                <SpinnerLoading size={30} />
                            ) : (
                                <Trash2Icon size={30} className={cn('text-gray-secondary transition-colors group-hover/tg-delete-btn:text-destructive/75')} />
                            )}
                        </Button>
                    </AskAction>
                </div>
            </div>
        </Card>
    );
};

export default TelegramAccountCard;

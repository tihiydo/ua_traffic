import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AskAction from "@/components/ui/custom/ask-action";
import BloggerAvatar from "@/components/ui/custom/blogger-avatar";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { cn } from "@/lib/utils";
import { Trash2, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {
  image: string;
  username: string | null;
  followersCount: number | null;
  setVerificationState?: any;
};

const AccountCard = ({
    image,
    followersCount,
    username,
    setVerificationState,
}: Props) => {
    const t = useTranslations("Blogger");

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
                        setVerificationState({ igToken: undefined, profileId: undefined })
                    }}>
                        <Button
                            disabled={!setVerificationState}
                            variant={'ghost'}
                            size={'icon'}
                            className="group/tg-delete-btn w-fit h-fit p-2"
                        >
                            {!setVerificationState ? (
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

export default AccountCard;

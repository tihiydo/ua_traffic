import React from 'react'
import TelegramBloggerForm from '../../_socials/telegram/components/telegram-blogger-form';
import { api } from "@/trpc/react";
import { toast } from 'react-toastify';
import { useRouter } from '@/i18n/navigation'
import { v4 } from 'uuid';

function TelegramTab() {
    const { push } = useRouter();

    const createBloggerMutation = api.blogger.createBlogger.useMutation({
        onSuccess: () => {
            push('/admin/moderation/bloggers')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (
        <div className="max-w-[40rem] w-full">
            {/* <AccountCard followersCount={verifyProcess.followersCount ?? 0} image={verifyProcess.photoUrl ?? ""} username={verifyProcess.title ?? ""} /> */}

            <TelegramBloggerForm
                isLoading={createBloggerMutation.isLoading}
                onSubmit={(data) => {
                    createBloggerMutation.mutate({
                        about: data.about,
                        prices: data.prices,
                        status: "Active",
                        followersCount: data.followersCount,
                        profilePicture: data.profilePicture,
                        categories: data.categories,
                        username: data.username,
                        profileLink: "https://t.me/" + data.username,
                        type: 'Telegram',
                        id: v4(),
                        userId: data.userId,
                        fake: true
                    })
                }}
            />
        </div>
    )
}

export default TelegramTab;
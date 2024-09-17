'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import AccountCard from '../../account-card';
import { MoveLeftIcon } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAccessToken } from '@/app/[locale]/(client)/blogger/new-channel/_hooks/use-access-token';
import { useTranslations } from 'next-intl'
import { useErrorTranslate } from '@/hooks/use-error';
import InstagramVerifyCard from './instagram-verify-card';
import InstagramBlankLoading from './instagram-blank-loading';
import ServerErrorMessage from '@/components/server-error-message';
import InstagramBloggerForm from '../../forms/instagram-blogger-form';
import { getWindow } from '@/utils/window';

export const IG_VERIF_STATE_PATH = "verification-channel";
export type InstagramVerificationState = Partial<{
    igToken: string;
    profileId: string;
}>;

const InstagramTab = () => {
    const window = getWindow();
    const bloggerT = useTranslations('Blogger')
    const utils = api.useUtils();
    const [verificationState, setVerificationState] = useLocalStorage<InstagramVerificationState>(IG_VERIF_STATE_PATH);
    const { push } = useRouter();
    const translateError = useErrorTranslate();
    const { createToken, isVerifying } = useAccessToken({
        onSuccess: (accessToken) => {
            setVerificationState({ igToken: accessToken.token, profileId: accessToken.profileId });
            getIGData.mutate({ profileId: accessToken.profileId });
        }
    });

    const getIGData = api.instagram.getIGData.useMutation();



    const { mutate: createBlogger, isLoading: isCreatingBlogger } = api.blogger.createBlogger.useMutation({
        onSuccess: () => {
            utils.blogger.haveOneChannel.setData(undefined, true)
            toast.success(bloggerT('channel-created'))
            push('/blogger/my-channels')
            setVerificationState({ igToken: undefined, profileId: undefined })

        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });
    const t = useTranslations();

    useEffect(() => {
        if (!verificationState?.profileId || getIGData.data) return;

        getIGData.mutate({ profileId: verificationState.profileId })
    }, [verificationState, getIGData.data])

    // Prevent hydration errors
    if (!window?.localStorage) {
        return null
    }

    if (!verificationState?.igToken) {
        return <InstagramVerifyCard isVerifying={isVerifying} onVerify={createToken} />
    };

    if (getIGData.isLoading) {
        return <InstagramBlankLoading />
    }

    if (getIGData.error) {
        return <ServerErrorMessage errorCode={getIGData.error.message} closable onClose={() => {
            setVerificationState({ igToken: undefined, profileId: undefined })
        }} />
    }

    if (!getIGData.data) return;

    return (
        <div className="max-w-[600px] w-full">
            <div className="mb-8">
                <h2 className="font-bold uppercase mb-2">{t("Blogger.channel")}</h2>
                {/* <Button
                    className='underline gap-2'
                    onClick={() => setVerificationState({ igToken: undefined, profileId: undefined })}
                    variant={'link'}
                >
                    <MoveLeftIcon size={20} />
                    Скинути
                </Button> */}
                <AccountCard followersCount={getIGData.data.followersCount ?? 0} image={getIGData.data.profilePicture ?? ''} username={getIGData.data.username} setVerificationState={setVerificationState} />
            </div >

            <InstagramBloggerForm
                isLoading={isCreatingBlogger}
                onSubmit={(formData) => {
                    createBlogger({
                        type: 'Instagram',
                        ...getIGData.data,
                        ...formData,
                        status: 'Moderating',
                        profileLink: `https://www.instagram.com/${getIGData.data.username}`
                    });
                }}
            />
        </div >
    )
}

export default InstagramTab
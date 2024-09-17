'use client';

import { env } from "@/env.mjs";
import { useErrorTranslate } from "@/hooks/use-error";
import { api } from "@/trpc/react";
import { type IGAccessToken } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Options = Partial<{
    onSuccess: (token: IGAccessToken) => void;
    onError: () => void;
    onSettled: () => void;
}>

export function useAccessToken({ onSettled, onSuccess }: Options = {}) {
    const [childWindow, setChildWindow] = useState<Maybe<Window>>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const code = useSearchParams().get('code')
    const [accessToken, setAccessToken] = useState<IGAccessToken | null>(null);
    const translateError = useErrorTranslate();

    const { mutate: createAccessToken } = api.instagram.createAccessToken.useMutation({
        onError: (error) => {
            toast.error(translateError(error.message))
        },
        onSuccess: (accessToken) => {
            setAccessToken(accessToken);
            onSuccess?.(accessToken);
        },
        onSettled: () => {
            onSettled?.()
        },

    });

    useEffect(() => {
        window.parent.addEventListener("message", function (event) {
            const receivedCodeData = event.data
            if (!receivedCodeData || !String(receivedCodeData).startsWith("code=")) return

            const receivedCode = String(receivedCodeData).split("=")[1]
            if (!receivedCode) {
                return
            };

            createAccessToken({ code: receivedCode })
        }, false);

        //SEARCH CODE
        if (code && window.opener) {
            window.opener.postMessage(`code=${code}`, "*");
            window.close();
        }
    }, []);

    // Check if child window is closed at intervals
    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof childWindow?.closed !== 'boolean') return;

            if (childWindow && childWindow.closed) {
                setIsVerifying(false)
                document.body.style.overflow = "auto"
            }
        }, 250);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [childWindow]);

    const handleVerificationStart = () => {
        document.body.style.overflow = "hidden"
        const childWindow = window.open(`https://api.instagram.com/oauth/authorize?client_id=${env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=https://uatraffic.com/blogger/new-channel&scope=user_profile,user_media&response_type=code`, "InstagramVerification", `width=700,height=700`);

        setIsVerifying(true)
        setChildWindow(childWindow);
    }

    return {
        accessToken,
        isVerifying: isVerifying,
        createToken: handleVerificationStart,
    }
}
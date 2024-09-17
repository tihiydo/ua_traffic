"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSignUpSession } from "../../_hooks/useSignUpSession";
import { useErrorTranslate } from "@/hooks/use-error";
import Translate from "@/components/Translate";
import { useTranslations } from "next-intl";

const RESEND_EMAIL_TIMEOUT = 1000 * 60;

const getResendLastingTime = (lastSendAt: number) => {
    return Date.now() - lastSendAt;
};

const ResendEmail = () => {
    const t = useTranslations();
    const { replace } = useRouter();
    const translateError = useErrorTranslate();
    const [signUpSession, setSignUpSession] = useSignUpSession();

    const { mutate } = api.user.resendVerificationEmail.useMutation({
        onMutate: () => {
            toast.loading(t('Default.email-sending'), { toastId: "resend-verification" });
        },
        onSuccess: () => {
            setSignUpSession({ lastSendDate: Date.now() });
            toast.success(
                t('Default.email-sent-to', {
                    email: signUpSession?.email
                })
            );
        },
        onError: (err) => {
            toast.error(translateError(err.message));
        },
        onSettled: () => {
            toast.dismiss("resend-verification");
        },
    });

    useEffect(() => {
        if (!signUpSession?.email) {
            toast.error(t('Auth.sign-up-context-lost'));
            replace("/sign-up");
        }
    }, [signUpSession, replace]);

    return (
        <>
            <p className="flex items-center">
                <Translate namespace="Auth.Check-Email" itemKey="not-received-letter-q" />
            </p>
            <Button
                className="font-bold"
                variant={"link"}
                onClick={() => {
                    if (!signUpSession?.email) {
                        return replace("/sign-up");
                    }

                    if (
                        signUpSession.lastSendDate &&
                        getResendLastingTime(signUpSession.lastSendDate) < RESEND_EMAIL_TIMEOUT
                    ) {
                        const secondsLeft = Math.max(
                            (new Date(
                                signUpSession.lastSendDate + RESEND_EMAIL_TIMEOUT,
                            ).getTime() -
                                new Date().getTime()) /
                            1000,
                            0,
                        ).toFixed(0);

                        return toast.error(
                            t('Auth.Check-Email.timeout-resend-letter-toast', {
                                seconds: secondsLeft
                            })
                        );
                    }

                    mutate(signUpSession.email);
                }}
            >
                <Translate namespace="Auth.Check-Email" itemKey="get-new-email" />
            </Button>
        </>
    );
};

export default ResendEmail;

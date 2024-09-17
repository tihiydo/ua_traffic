"use client";

import Translate from "@/components/Translate";
import ServerErrorMessage from "@/components/server-error-message";
import { Button } from "@/components/ui/button";
import InfoMessage from "@/components/ui/custom/info-message";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { Link } from "@/i18n/navigation";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";


const UserVerifyPage = () => {
    const t = useTranslations();
    const {
        mutate: verifyEmail,
        data: user,
        isLoading,
        isSuccess,
        error,
    } = api.user.verifyEmail.useMutation({});
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!!user?.emailVerified) return;

        const verificationToken = searchParams.get("verificationToken");

        verifyEmail({ tokenString: verificationToken ?? "" });
    }, []);

    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-[100%]" >
                <div>
                    <h2 className="mb-6 w-[300px] font-title text-[2rem] uppercase text-main">
                        <Translate namespace="Auth.User-Verify" itemKey="title" />
                    </h2>
                    {error?.message ? (
                        <ServerErrorMessage
                            errorCode={error?.message}
                            closable={false}
                        />
                    ) : isSuccess ?
                        (
                            <>
                                <InfoMessage variant={'success'} >
                                    <Translate namespace="Auth.User-Verify" itemKey="success-verification-title" />
                                </InfoMessage>


                                <div className="mt-3">
                                    <p className="text-sm">
                                        {t.rich('Auth.User-Verify.success-verification-desc', {
                                            login: (chunks) => (
                                                <Link className="font-bold underline" href={"/login"}>
                                                    {chunks}
                                                </Link>
                                            )
                                        })}
                                    </p>
                                </div>
                            </>
                        ) : isLoading ? (
                            <InfoMessage icon={<SpinnerLoading className="text-gray-secondary" />}>
                                <Translate namespace="Auth.User-Verify" itemKey="verifying" />
                            </InfoMessage>
                        ) : null}

                    <Link href={'/sign-up'} className="mt-5 block">
                        <Button>
                            <Translate namespace="Default" itemKey="sign-up" />
                        </Button>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default UserVerifyPage;

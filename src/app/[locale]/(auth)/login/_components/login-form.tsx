"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "next-auth/react";
import GoogleAuthButton from "../../_components/google-auth-button";
import { api } from "@/trpc/react";
import { useSignUpSession } from "../../_hooks/useSignUpSession";
import { toast } from "react-toastify";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { useMutableSearchParams } from "@/hooks/use-mutable-search-params";
import ServerErrorMessage from "@/components/server-error-message";
import { ERROR_CODES } from "@/constants/error-codes";
import FormInput from "@/components/ui/custom/form/form-input";
import { useTranslations } from "next-intl";
import { useZodSchema } from "@/hooks/use-zod-schema";
import { env } from "@/env.mjs";
import ReCAPTCHA from "react-google-recaptcha";
import Translate from "@/components/Translate";
import { useSearchParams } from 'next/navigation';

type LoginFormData = {
    email: string;
    password: string;
    captcha: string;
}

const LoginForm = () => {
    const { replace } = useRouter();
    const validationT = useTranslations('Validation');
    const authLoginT = useTranslations('Auth.Login')
    const t = useTranslations();

    const schema = useZodSchema<LoginFormData>(() => {
        return z.object({
            email: z.string().email(validationT('invalid-email')),
            password: z.string().min(1, validationT('required-field')),
            captcha: z.string().min(1),
        });
    }, [])

    const formController = useForm<LoginFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: "",
            password: "",
            // captcha: "",
        },
    });
    const [, setSignUpSession] = useSignUpSession();
    const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
    const { mutate: resendVerificationEmail } = api.user.resendVerificationEmail.useMutation();

    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
        setError,
    } = formController;
    const mutableSearchParams = useMutableSearchParams();
    const searchParams = useSearchParams()

    useEffect(() => {
        const queryErrorCode = searchParams.get('err')
        const email = searchParams.get('email')
        if (!queryErrorCode) return;

        mutableSearchParams.delete('err')
        mutableSearchParams.delete('email')

        if (queryErrorCode == ERROR_CODES.USER_TWOFA_GOOGLE && email) {
            toast.info(
                t('Messages.complete-2fa'),
            );
            setSignUpSession({
                email: email,
            });
            replace("/google-two-fa");
        } else {
            setError('root', { message: queryErrorCode })
        }
    }, [])

    return (
        <Form {...formController}>
            <form
                className="w-full"
                onSubmit={handleSubmit(async (data) => {
                    try {
                        setIsLoadingCredentials(true);
                        const res = await signIn("credentials",
                            {
                                email: data.email,
                                password: data.password,
                                redirect: false,
                            });

                        if (!res?.ok) {
                            if (res?.error === ERROR_CODES.USER_NOT_VERIFIED) {
                                resendVerificationEmail(data.email, {
                                    onSuccess: () => {
                                        toast.info(
                                            t('Messages.verif-email-sent', { email: data.email }),
                                        );
                                        setSignUpSession({
                                            email: data.email,
                                            lastSendDate: Date.now(),
                                        });
                                        replace("/check-email");
                                    },
                                    onError: (error) => {
                                        setError('root', { message: error.message })
                                    }
                                });
                            }
                            if (res?.error === ERROR_CODES.USER_TWOFA_GOOGLE) {
                                toast.success(
                                    t('Messages.complete-2fa'),
                                );
                                setSignUpSession({
                                    email: data.email,
                                    password: btoa(data.password)
                                });
                                replace("/google-two-fa");
                            }

                            return setError("root", { message: res?.error ?? "" });
                        }

                        replace(`/catalog`);
                    } finally {
                        setIsLoadingCredentials(false);
                    }
                })}
            >
                {!!errors.root?.message && (
                    <ServerErrorMessage
                        errorCode={errors.root.message}
                        className="lg:mb-5 mb-3"
                        onClose={() => setError('root', { message: '' })}
                    />
                )}

                <FormInput
                    control={control}
                    name="email"
                    type="email"
                    label={authLoginT('email-label')}
                    placeholder={authLoginT('email-placeholder')}
                    className="lg:mb-5 mb-3"
                />

                <div className="mb-3">
                    <FormInput
                        control={control}
                        name="password"
                        type="password"
                        label={authLoginT('password-label')}
                        placeholder={authLoginT('password-placeholder')}
                    />

                    <Link
                        href={"/forgot-password"}
                        className="ml-auto sm:mt-2 mt-1 block w-fit sm:text-sm text-xs hover:underline"
                    >
                        <Translate namespace="Auth.Login" itemKey="forgot-passwod" />
                    </Link>
                </div>

                <div className="lg:mb-5 mb-3 flex items-center gap-1 sm:gap-2 font-content sm:text-sm text-xs flex-wrap">
                    <p>
                        <Translate namespace="Auth.Login" itemKey="not-registered-q" />
                    </p>
                    <Link className="font-bold hover:underline" href={"sign-up"}>
                        <Translate namespace="Auth.Login" itemKey="to-register" />
                    </Link>
                </div>

                <FormField
                    control={control}
                    name="captcha"
                    render={({ field }) => (
                        <FormItem className="w-full overflow-hidden">
                            <ReCAPTCHA
                                className="mb-5 max-h-24 max-w-[200px] sm:max-w-none sm:scale-100 sm:origin-center scale-[80%] origin-[0_0]"
                                sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                onChange={field.onChange}
                            />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    size={"lg"}
                    className="lg:mb-4 mb-3 w-full"
                    disabled={isLoadingCredentials || !isValid}
                >
                    {isLoadingCredentials && <SpinnerLoading className="mr-2" />}
                    <Translate namespace="Auth.Login" itemKey="submit" />
                </Button>

                <div className="relative lg:mb-5 mb-3">
                    <Separator className="absolute top-1/2 " />
                    <p className="relative mx-auto w-fit bg-white sm:px-5 px-3 text-xs sm:text-sm">
                        <Translate namespace="Auth" itemKey="auth-with" />
                    </p>
                </div>

                <GoogleAuthButton disabled={isLoadingCredentials} />
            </form>
        </Form>
    );
};

export default LoginForm;

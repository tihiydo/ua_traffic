"use client";

import { useForm } from "react-hook-form";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import GoogleAuthButton from "../../_components/google-auth-button";
import { useRouter } from "@/i18n/navigation";
import { useSignUpSession } from "../../_hooks/useSignUpSession";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { env } from "@/env.mjs";
import ServerErrorMessage from "@/components/server-error-message";
import FormInput from "@/components/ui/custom/form/form-input";
import { useTranslations } from "next-intl";
import { useZodSchema } from "@/hooks/use-zod-schema";
import { getPasswordSchema } from "@/schemas/password";
import Translate from "@/components/Translate";

type SignUpFormData = {
    email: string;
    password: string;
    captcha: string;
}
const SignUpForm = () => {
    const validationT = useTranslations('Validation');
    const authSingUpT = useTranslations('Auth.Sign-Up')
    const schema = useZodSchema<SignUpFormData>(() => {
        return z.object({
            email: z.string().email(validationT('invalid-email')),
            password: getPasswordSchema(validationT),
            captcha: z.string().min(1),
        });
    }, [])
    const [, setSignUpSession] = useSignUpSession();
    const { push } = useRouter();
    const { mutate: createUser, isLoading } = api.user.createUser.useMutation();
    const formController = useForm<SignUpFormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const {
        handleSubmit,
        control,
        setError,
        formState: { errors, isValid },
    } = formController;

    return (
        <Form {...formController}>
            <form
                className="max-w-[400px]"
                onSubmit={handleSubmit(async (formData) => {
                    createUser(formData, {
                        onSuccess: () => {
                            toast.success(authSingUpT('verify-toast'));
                            setSignUpSession({
                                email: formData.email,
                                lastSendDate: Date.now(),
                            });
                            push("/check-email");
                        },
                        onError: (err) => {
                            setError("root", { message: err.message });
                        },
                    });
                })}
            >
                {!!errors.root?.message && (
                    <ServerErrorMessage
                        errorCode={errors.root.message}
                        className="lg:mb-5 mb-3"
                        onClose={() => setError("root", { message: "" })}
                    />
                )}

                <FormInput
                    control={control}
                    name="email"
                    type="email"
                    label={authSingUpT('email-label')}
                    placeholder={authSingUpT('email-placeholder')}
                    className="lg:mb-5 mb-3"
                />

                <FormInput
                    control={control}
                    name="password"
                    type="password"
                    label={authSingUpT('password-label')}
                    placeholder={authSingUpT('password-placeholder')}
                    className="mb-2"
                />

                <div className="lg:mb-5 mb-3 flex items-center gap-2 font-content sm:text-sm text-xs">
                    <p>
                        <Translate namespace="Auth.Sign-Up" itemKey="have-acc-q" />
                    </p>
                    <Link href={"login"} className="font-bold hover:underline">
                        <Translate namespace="Auth.Sign-Up" itemKey="login" />
                    </Link>
                </div>

                <FormField
                    control={control}
                    name="captcha"
                    render={({ field }) => (
                        <ReCAPTCHA
                            className="mb-5 max-h-24 max-w-[200px] sm:max-w-none sm:scale-100 sm:origin-center scale-[80%] origin-[0_0]"
                            sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Button
                    type="submit"
                    size={"lg"}
                    className="lg:mb-4 mb-3 w-full"
                    disabled={isLoading || !isValid}
                >
                    {isLoading && <SpinnerLoading className="mr-2" />}
                    <Translate namespace="Auth.Sign-Up" itemKey="submit" />
                </Button>

                <div className="relative lg:mb-5 mb-3">
                    <Separator className="absolute top-1/2 " />
                    <p className="relative mx-auto w-fit bg-white  text-xs sm:text-sm sm:px-5 px-3">
                        <Translate namespace="Auth" itemKey="auth-with" />
                    </p>
                </div>

                <GoogleAuthButton />
            </form>
        </Form>
    );
};

export default SignUpForm;

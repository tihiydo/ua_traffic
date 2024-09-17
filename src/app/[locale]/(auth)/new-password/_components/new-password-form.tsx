"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import ServerErrorMessage from "@/components/server-error-message";
import FormInput from "@/components/ui/custom/form/form-input";
import Translate from "@/components/Translate";
import { useTranslations } from "next-intl";
import { getPasswordSchema } from "@/schemas/password";
import { useZodSchema } from "@/hooks/use-zod-schema";
import { ERROR_CODES } from "@/constants/error-codes";

const NewPasswordForm = () => {
    const { replace } = useRouter();
    const validationT = useTranslations('Validation')
    const authNewPasswordT = useTranslations('Auth.New-Password');

    const schema = useZodSchema(() => {
        return z
            .object({
                password: getPasswordSchema(validationT, { length: 6 }),
                passwordRepeat: z.string().min(1, validationT('required-field')),
            })
            .refine(
                (data) => {
                    return data.passwordRepeat === data.password;
                },
                { message: validationT('password-dont-match'), path: ["passwordRepeat"] },
            );
    }, [])


    const { get } = useSearchParams();
    const { mutate: changePassword, isLoading } =
        api.user.changePassword.useMutation({
            onSuccess: () => {
                toast.success(authNewPasswordT('password-change-success'));
                replace("/login");
                reset()
            },
            onError: (error) => {
                setError("root", { message: error.message });
            },
        });
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            password: '',
            passwordRepeat: ''
        }
    });
    const {
        handleSubmit,
        control,
        setError,
        reset,
        formState: { errors },
    } = form;

    return (
        <Form {...form}>
            <form
                className="w-full"
                onSubmit={handleSubmit((data) => {
                    const passwordToken = get("passwordToken");
                    if (!passwordToken) {
                        toast.error(validationT(ERROR_CODES.ANY_TOKEN_NOT_FOUND));

                        return 
                    }

                    changePassword({ newPassword: data.password, token: passwordToken });
                })}
            >
                {!!errors.root?.message && (
                    <ServerErrorMessage
                        errorCode={errors.root.message}
                        className="mb-6"
                        onClose={() => setError("root", { message: "" })}
                    />
                )}

                <FormInput
                    control={control}
                    name={"password"}
                    className="mb-8"
                    label={authNewPasswordT('password-label')}
                    placeholder={authNewPasswordT('password-placeholder')}
                    type="password"
                />

                <FormInput
                    control={control}
                    name={"passwordRepeat"}
                    className="mb-8"
                    label={authNewPasswordT('password-repeat-label')}
                    placeholder={authNewPasswordT('password-repeat-placeholder')}
                    type="password"
                />

                <Button type="submit" size={"lg"} className="w-full" disabled={isLoading}>
                    {isLoading && <SpinnerLoading className="mr-2" />}
                    <Translate namespace="Auth.New-Password" itemKey="submit" />
                </Button>
            </form>
        </Form>
    );
};

export default NewPasswordForm;

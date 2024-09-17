"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { getPasswordSchema } from "@/schemas/password";
import FormInput from "@/components/ui/custom/form/form-input";
import { signOut } from "next-auth/react";
import { useMutableSearchParams } from "@/hooks/use-mutable-search-params";
import { useTranslations } from "next-intl";
import { useZodSchema } from "@/hooks/use-zod-schema";
import ServerErrorMessage from "@/components/server-error-message";


type ChangePasswordFormData = {
    password: string;
    passwordRepeat: string
}

type Props = {
    token: string
}

const ChangePasswordForm = ({ token }: Props) => {
    const t = useTranslations('Validation');
    const schema = useZodSchema<ChangePasswordFormData>(() => {
        return z
            .object({
                password: getPasswordSchema(t, { length: 8 }),
                passwordRepeat: z.string().min(1, t('required-field')),
            })
            .refine(
                (data) => {
                    return data.passwordRepeat === data.password;
                },
                { message: t('password-dont-match'), path: ["passwordRepeat"] },
            );
    }, [])
    const { delete: deleteSearchParam } = useMutableSearchParams();
    const { mutate: changePassword, isLoading } =
        api.user.changePassword.useMutation({
            onSuccess: () => {
                toast.success("Пароль успішно змінено");
                signOut({ callbackUrl: '/login' });
            },
            onError: (error) => {
                setError("root", { message: error.message });
            },
        });
    const form = useForm<ChangePasswordFormData>({
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
        formState: { errors },
    } = form;

    return (
        <Form {...form}>
            <form
                className="w-full"
                onSubmit={handleSubmit((data) => {
                    changePassword({ newPassword: data.password, token });
                })}
            >
                {!!errors.root?.message && (
                    <ServerErrorMessage
                        className="mb-8"
                        onClose={() => setError("root", { message: "" })}
                        errorCode={errors.root?.message}
                    />
                )}

                <FormInput
                    control={control}
                    name="password"
                    label={'Пароль'}
                    placeholder="Новий пароль"
                    type="password"
                    className="mb-3"

                />

                <FormInput
                    control={control}
                    name="passwordRepeat"
                    label={'Повторіть пароль'}
                    placeholder="Новий пароль"
                    type="password"
                />

                <div className="mt-5 gap-5 flex items-center">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <SpinnerLoading className="mr-2" />}
                        Підтвердити
                    </Button>

                    <Button type="button" disabled={isLoading} onClick={() => {
                        deleteSearchParam('p-token')
                    }}>
                        Не змінювати
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ChangePasswordForm;

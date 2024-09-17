"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import ServerErrorMessage from "@/components/server-error-message";
import Translate from "@/components/Translate";
import { useTranslations } from "next-intl";
import FormInput from "@/components/ui/custom/form/form-input";
import { useZodSchema } from "@/hooks/use-zod-schema";

const ForgotPasswordForm = () => {
    const authForgotPasswordT = useTranslations('Auth.Forgot-Password')
    const validationT = useTranslations('Validation');

    const schema = useZodSchema(() => {
        return z.object({
            email: z.string().email(validationT('invalid-email')),
        });
    }, [])
    const { mutate, isSuccess, isLoading } =
        api.user.sendPasswordResetEmail.useMutation();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            email: "",
        },
    });
    const { handleSubmit, control, setError, formState: { errors } } = form;

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit((data) => {
                    mutate(data.email, {
                        onSuccess: () => {
                            toast.success(
                                `Лист для підтвердження зміни паролю надіслано на адресу ${data.email}`,
                            );
                        },
                        onError: (error) => {
                            setError('root', { message: error.message })
                        }
                    });
                })}
            >
                {!!errors.root?.message && (
                    <ServerErrorMessage
                        errorCode={errors.root.message}
                        className="mb-8"
                        onClose={() => setError('root', { message: '' })}
                    />
                )}

                <FormInput
                    control={control}
                    name="email"
                    className="mb-6"
                    label={authForgotPasswordT("email-label")}
                    placeholder={authForgotPasswordT('email-placeholder')}
                    type="email"
                />

                <Button
                    disabled={isSuccess || isLoading}
                    type="submit"
                    className="w-full "
                    size={"lg"}
                >
                    {isLoading && <SpinnerLoading size={20} className="mr-2 " />}
                    <Translate namespace="Auth.Forgot-Password" itemKey="next" />
                </Button>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;

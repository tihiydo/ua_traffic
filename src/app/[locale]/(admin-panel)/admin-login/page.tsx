"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/custom/form/form-input";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { toast } from "react-toastify";

const adminSignInSchema = z.object({
    password: z.string().min(1, "Поле обов'язкове"),
    email: z.string().min(1, "Поле обов'язкове"),
});
type FormData = z.infer<typeof adminSignInSchema>;

const AdminLoginPage = () => {
    const { replace } = useRouter();
    const form = useForm<FormData>({
        defaultValues: {
            password: "",
            email: ""
        },
        mode: "onBlur",
        resolver: zodResolver(adminSignInSchema),
    });
    const { handleSubmit, control, reset, formState: { isSubmitting } } = form;

    return (
        <div
            className={
                "flex h-[70vh] w-full flex-col items-center justify-center p-5"
            }
        >
            <Card className={"w-full max-w-2xl border-gray shadow-md"}>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(async (data) => 
                            {
                            const res = await signIn('credentials', 
                            {
                                email: data.email,
                                password: data.password,
                                redirect: false
                            })

                            if (!res?.ok) 
                            {
                                toast.error(res?.error);
                                reset()
                                return
                            }
                            else
                            {
                                replace('/admin');
                            }
                        })}
                    >
                        <CardHeader>
                            <CardTitle className={"border-b pb-4"}>
                                Вхід у адмінпанель / панель модерації
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormInput
                                type={"email"}
                                name={"email"}
                                control={control}
                                label={"Пошта"}
                                description={"Введіть пошту для входу"}
                                placeholder={"Введіть пошту..."}
                                className="mb-4"
                            />
                            <FormInput
                                type={"password"}
                                name={"password"}
                                control={control}
                                label={"Пароль"}
                                description={"Введіть пароль для входу"}
                                placeholder={"Введіть пароль..."}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <SpinnerLoading className="mr-2" />}
                                Увійти
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default AdminLoginPage;

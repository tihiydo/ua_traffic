"use client";

import InfoMessage from "@/components/ui/custom/info-message";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { useSignUpSession } from "../_hooks/useSignUpSession";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import GoogleAuthButton from "../_components/google-auth-button";
import FormInput from "@/components/ui/custom/form/form-input";
import Translate from "@/components/Translate";
import { useTranslations } from "next-intl";
import { useZodSchema } from "@/hooks/use-zod-schema";

const UserGoogleTwoFaPage = () => {
    const authTwoFaT = useTranslations('Auth.TwoFA');
    const validationT = useTranslations('Validation');


    const [signUpSession, setSignUpSession] = useSignUpSession();
    const [googleUserForm, setGoogleUserForm] = useState<boolean>(false)
    const { mutate: setTwoFaForGoogleUsersIsChecked } = api.user.twofaSetChecked.useMutation()
    const { mutate: checkTwoFaGoogle, isLoading } = api.user.twofaVerify.useMutation({
        onSuccess: async (resp) => {
            if (resp) {
                if (signUpSession !== undefined && signUpSession.password != null) {
                    await signIn('credentials',
                        {
                            email: signUpSession?.email,
                            password: signUpSession?.password,
                        })
                } else {
                    setGoogleUserForm(true)
                    setTwoFaForGoogleUsersIsChecked({
                        email: signUpSession?.email || "",
                        entered: true
                    })
                    toast.success(authTwoFaT('pin-correct'))
                }

                setSignUpSession({ email: '', lastSendDate: null, password: undefined })
            } else {
                toast.error(validationT('wrong-pin'))
            }
        }
    });

    const Schema = useZodSchema(() => {
        return z.object({
            pincode: z.string()
                .refine(el => (
                    el.replace(" ", "").length == 6
                ), validationT('exact-length', { length: 6 }))

        })
    }, [])

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            pincode: "",
        },
    })

    async function onSubmit(data: z.infer<typeof Schema>) {
        checkTwoFaGoogle({ pin: data.pincode.replace(" ", ""), email: signUpSession?.email || "" })
    }

    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-[100%]" >
                <div>
                    <h2 className="mb-6 w-[300px] font-title text-[2rem] uppercase text-main">
                        <Translate namespace="Auth.TwoFA" itemKey='title' />
                    </h2>
                    <>
                        {!googleUserForm ?
                            <>
                                {!!signUpSession?.email?.length && (
                                    <InfoMessage variant={"default"} >
                                        {authTwoFaT('info-message', {
                                            email: signUpSession?.email
                                        })}

                                    </InfoMessage>
                                )}

                                <div className="mt-3">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <FormInput
                                                control={form.control}
                                                name="pincode"
                                                className="w-full"
                                                label={authTwoFaT('pin-label')}
                                                placeholder={authTwoFaT('pin-placeholder')}
                                            />

                                            <Button type="submit" className="w-44" disabled={isLoading}>
                                                {
                                                    isLoading ?
                                                        <SpinnerLoading color="#000000" />
                                                        :
                                                        <Translate namespace="Default" itemKey="log-in" />
                                                }
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                            </>
                            :
                            <>
                                <InfoMessage variant={"success"} >
                                    <Translate namespace="Auth.TwoFA" itemKey='google-auth-repeat' />
                                </InfoMessage>


                                <div className="mt-8">
                                    <GoogleAuthButton disabled={isLoading} />
                                </div>

                            </>}
                    </>
                </div>
            </div>
        </div >
    );
};

export default UserGoogleTwoFaPage;

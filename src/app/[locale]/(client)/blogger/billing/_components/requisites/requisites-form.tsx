'use client'

import CreditCardInputMask from "credit-card-input-mask"
import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import isCreditCard from 'validator/lib/isCreditCard';
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import { CardBank } from '@prisma/client'
import Image from 'next/image'
import mastercard from "@/assets/mastercard.png"
import { twMerge } from 'tailwind-merge'
import { toast } from "react-toastify"

type Props = {
    isLoading?: boolean;
    onSubmit?: (value: any, card: CardBank) => void;
}

const RequisitesForm = ({ isLoading = false, onSubmit }: Props) => {
    const t = useTranslations("Blogger");
    const validationT = useTranslations("Validation");
    const [cardType, setCardType] = useState<CardBank>("Mastercard")

    const requisitesFormSchema = z.object({
        card: z
            .string()
            .min(1, validationT('required-field'))
            .refine((el) => 
            {
                const t = el.replaceAll(" ", "")
                const l = t.length == 16
                return l
            }, validationT("invalid-card")),
        fio: z.string().refine((str) => {
            const strLenght = str.length >= 6
            const strSplit = str.split(" ").length >= 2

            return strLenght && strSplit
        }, validationT("fioinncorect"))
    })
    type RequisitesFormData = z.infer<typeof requisitesFormSchema>;

    const form = useForm<RequisitesFormData>({
        resolver: zodResolver(requisitesFormSchema),
        mode: 'onBlur',
        defaultValues: {
            card: '',
            fio: ''
        }
    });
    const { control, handleSubmit } = form;


    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit((data) => {
                    onSubmit?.(data, cardType);
                })}
            >

                <FormInput
                    disabled={isLoading}
                    control={control}
                    name='card'
                    className='mb-7'
                    mask="9999 9999 9999 9999"
                    label={<Translate namespace='Blogger' itemKey='ourdetails' />}
                    placeholder={"0000 0000 0000 0000"}
                />

                <div className='flex flex-row gap-x-[4rem] w-full my-3 justify-center mb-5'>
                    <div onClick={() => setCardType("Mastercard")} className={twMerge("cursor-pointer p-3 rounded-lg border border-[#8080801a] size-[7rem]", cardType == "Mastercard" ? "ring-yellow ring-2 ring-offset-2 ring-offset-white" : "")}>
                        <Image src={mastercard} alt="mastercard" />
                    </div>
                    <div onClick={() => setCardType("Other")} className={twMerge("cursor-pointer font-bold flex items-center justify-center p-3 rounded-lg border border-[#8080801a] size-[7rem]", cardType == "Other" ? 'ring-yellow ring-2 ring-offset-2 ring-offset-white' : "")}>
                        OTHER
                    </div>
                </div>

                <FormInput
                    disabled={isLoading}
                    control={control}
                    name='fio'
                    label={t("fio")}
                    placeholder={t("fioexample")}
                />

                <Button className='mt-6 w-full' type={'submit'} disabled={isLoading}>
                    {isLoading && <SpinnerLoading className='mr-2' />}
                    <Translate namespace="Blogger" itemKey="add" />
                </Button>
            </form>
        </Form>
    )
}

export default RequisitesForm

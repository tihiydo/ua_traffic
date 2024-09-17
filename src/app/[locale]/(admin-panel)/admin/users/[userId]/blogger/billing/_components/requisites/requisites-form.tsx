'use client'

import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import isCreditCard from 'validator/lib/isCreditCard';
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'

type Props = {
    isLoading?: boolean;
    onSubmit?: (value: any) => void;
}

const RequisitesForm = ({ isLoading = false, onSubmit }: Props) => {
    const t = useTranslations("Blogger");
    const validationT = useTranslations("Validation");

    const requisitesFormSchema = z.object({
        card: z
            .string()
            .min(1, validationT('required-field'))
            .refine(isCreditCard, validationT("invalid-card")),
    })
    type RequisitesFormData = z.infer<typeof requisitesFormSchema>;

    const form = useForm<RequisitesFormData>({
        resolver: zodResolver(requisitesFormSchema),
        mode: 'onBlur',
        defaultValues: {
            card: '',
        }
    });
    const { control, handleSubmit } = form;


    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit((data) => {
                    onSubmit?.(data);
                })}
            >
                <FormInput
                    disabled={isLoading}
                    control={control}
                    name='card'
                    label={<Translate namespace='Blogger' itemKey='ourdetails' />}
                    placeholder={t("ourdetails")}
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

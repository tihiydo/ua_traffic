import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Form } from '@/components/ui/form'
import { useZodSchema } from '@/hooks/use-zod-schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
    onSubmit: (data: ChangeEmailFormData) => void;
    isLoading?: boolean;
    disabled?: boolean;
    currentEmail: string;
}

type ChangeEmailFormData = {
    email: string;
}

const ChangeEmailForm = ({ onSubmit, isLoading, currentEmail, disabled }: Props) => {
    const t = useTranslations('Validation');
    const schema = useZodSchema<ChangeEmailFormData>(() => {
        return z.object({
            email: z.string()
                .min(1, t('required-field'))
                .email(t('invalid-email'))
                .refine(inputEmail => inputEmail !== currentEmail, t('other-email'))
        })
    }, [currentEmail])


    const form = useForm<ChangeEmailFormData>({
        mode: 'onBlur',
        resolver: zodResolver(schema),
        defaultValues: {
            email: ''
        }
    })
    const { control, handleSubmit } = form;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit((data) => {
                onSubmit(data);
            })}>
                <FormInput
                    className='mb-3'
                    disabled={isLoading || disabled}
                    control={control}
                    name='email'
                    type='email'
                    label={<Translate namespace='Profile' itemKey='emaillabel'/>}
                    placeholder={'example@gmail.com'}
                />

                <Button disabled={isLoading || disabled} type='submit'>
                    {isLoading && <SpinnerLoading className='mr-2' />}
                    <Translate namespace='Profile' itemKey='sendemail'/>
                </Button>
            </form>
        </Form>
    )
}

export default ChangeEmailForm
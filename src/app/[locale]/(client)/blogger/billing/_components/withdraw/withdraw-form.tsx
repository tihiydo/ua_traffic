import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import RequisitesSelect from './requisites-select'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Button } from '@/components/ui/button'
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import { useZodSchema } from '@/hooks/use-zod-schema'
import { MIN_WITHDRAW_AMOUNT } from '../../constants'
import { intRegEx } from '@/regex'
import { api } from '@/trpc/react';
import { twMerge } from 'tailwind-merge'

type Props = {
    isLoading?: boolean;
    onSubmit?: (data: WithdrawFormData) => void;
    close?: () => void;
}

type WithdrawFormData = {
    cardNumber: string;
    amount: string;
};

const WithdrawForm = ({ isLoading = false, onSubmit, close }: Props) => {
    const t = useTranslations("Blogger");
    const validationT = useTranslations("Validation");
    const schema = useZodSchema(() => {
        return z.object({
            cardNumber: z.string().min(1, validationT('required-field')),
            amount: z
                .string({ required_error: validationT("required-field") })
                .regex(intRegEx, validationT('invalid-number')).refine((arg) => {
                    const amountInt = parseInt(arg);

                    return amountInt >= MIN_WITHDRAW_AMOUNT
                }, validationT('min-withdraw', { amount: MIN_WITHDRAW_AMOUNT })),
        })
    }, [])
    const { isLoading: isLoadingFee, data: fee } = api.fee.getFee.useQuery({ type: "Widthdraw" })
    const form = useForm<WithdrawFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            amount: '',
            cardNumber: ''
        }
    });
    const { handleSubmit, control, watch } = form;

    const amount = parseFloat(watch("amount"))
    const calculatedAmount =
        (
            (amount && !isNaN(amount) && amount >= 200 && fee !== undefined && !isLoadingFee)
                ?
                (amount * ((100 - fee) / 100)).toFixed(2)
                :
                false
        )
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit((data) => {
                onSubmit?.(data)
            })}>
                <FormField
                    control={control}
                    name='cardNumber'
                    render={({ field }) => (
                        <FormItem className='mb-3'>
                            <FormLabel className='mb-2 font-bold block'><Translate namespace='Blogger' itemKey='selectreq' /></FormLabel>

                            <FormControl>
                                <RequisitesSelect onChange={field.onChange} value={field.value} close={close} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="inline-flex flex-row w-full relative">
                    <FormInput
                        control={control}
                        name='amount'
                        label={t("ammount")}
                        className={twMerge("w-full", calculatedAmount !== false ? "mb-[2rem] " : "")}
                        placeholder={t("ammount")}
                    />

                    {calculatedAmount !== false ? <div className='absolute text-right text-[10px] text-gray-last right-0 bottom-0'>
                        {t("deposit-other", { amount: calculatedAmount })}
                    </div> : <></>}
                </div>

                <div className='mt-5'>
                    <Button type='submit' className='w-full' disabled={isLoading}>
                        {isLoading && <SpinnerLoading className='mr-2' />}

                        {t("sendtowidthrawal")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default WithdrawForm
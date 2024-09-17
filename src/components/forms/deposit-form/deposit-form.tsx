'use client'

import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Form } from '@/components/ui/form'
import { useZodSchema } from '@/hooks/use-zod-schema'
import { intRegEx } from '@/regex'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/trpc/react';
import { twMerge } from 'tailwind-merge'

const MIN_DEPOSIT_AMOUNT = 200;

type Props = {
    onSubmit?: (data: DepositFormData) => void;
    isLoading?: boolean;
}

type DepositFormData = {
    amount: string;
}

const DepositForm = ({ onSubmit, isLoading }: Props) => {
    const { isLoading: isLoadingFee, data: fee } = api.fee.getFee.useQuery({ type: "Deposit" })
    const { isLoading: isLoadingBonus, data: bonus } = api.fee.getFee.useQuery({ type: "Bonus" })
    const { isLoading: haveReferals, data: referrals } = api.user.haveReferrals.useQuery()

    const validationT = useTranslations('Validation');

    const schema = useZodSchema<DepositFormData>(() => {
        return z.object({
            amount: z
                .string({ required_error: validationT("required-field") })
                .regex(intRegEx, validationT('invalid-number'))
                .refine(arg => {
                    const argInt = parseInt(arg);

                    return argInt >= MIN_DEPOSIT_AMOUNT;
                }, validationT('min-deposit', { amount: MIN_DEPOSIT_AMOUNT }))
        })
    }, [])

    const form = useForm<DepositFormData>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: {
            amount: '',
        }
    });
    const { handleSubmit, control, watch } = form;
    const t = useTranslations("Blogger")
    const amount = parseFloat(watch("amount"))

    const bonusint = referrals && bonus !== undefined ? (amount * (bonus / 100)) : 0
    const calculatedAmount =
        (
            (amount && !isNaN(amount) && amount >= 200 && fee !== undefined && bonus !== undefined && referrals !== undefined)
                ?
                ((amount * ((100 - fee) / 100)) + bonusint).toFixed(2)
                :
                false
        )

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(data => {
                onSubmit?.(data);
            })}>
                <div className=" inline-flex flex-row w-full relative">
                    <FormInput
                        control={control}
                        placeholder='ex: 5500'
                        className={twMerge("w-full", calculatedAmount !== false ? "mb-[2rem] " : "mb-4")}
                        disabled={isLoading}
                        label={<Translate namespace='Advertiser' itemKey='addamount' />}
                        name='amount'
                    />

                    {calculatedAmount !== false ? <div className='absolute text-right text-[10px]  right-0 bottom-[12px] text-gray-last'>
                        {t("deposit-other", { amount: calculatedAmount })}
                    </div> : <></>}
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading && <SpinnerLoading className='mr-2' />}

                    <Translate namespace="Advertiser" itemKey="addmoney" />
                </Button>
            </form>
        </Form>
    )
}

export default DepositForm
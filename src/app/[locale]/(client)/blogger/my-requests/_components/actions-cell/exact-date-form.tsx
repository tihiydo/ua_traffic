'use client'

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { TimePicker } from '@/components/ui/custom/time-picker/time-picker';
import SingleDatePicker from '@/components/ui/date-pickers/single-date-picker';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useZodSchema } from '@/hooks/use-zod-schema';
import { changeDate, isWithinHoursMinutesInterval } from '@/utils/dates';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { addDays, format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import InfoMessage from '@/components/ui/custom/info-message';

type Props = {
    onSubmit: (exactDate: Date) => void;
    isLoading?: boolean;
    fromDate: Date;
    toDate: Date;
}

type ExactDateFormData = {
    date: Date;
    time: Date;
}

const ExactDateForm = ({ onSubmit, isLoading = false, toDate, fromDate }: Props) => {
    const validationT = useTranslations('Validation')

    const schema = useZodSchema<ExactDateFormData>(() => {
        return z.object({
            date: z.date({ required_error: validationT("required-field") }),
            time: z
                .date()
                .refine(arg => {
                    return isWithinHoursMinutesInterval(arg, { start: fromDate, end: toDate })
                }, { message: validationT("unsatisfactory-advertiser-time") }),
        })
    }, [])

    const form = useForm<ExactDateFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            time: changeDate(new Date(), 0, 0),
        }
    });

    const { control, handleSubmit, watch, formState: { isValid } } = form

    const formData = watch()

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(({ date, time }) => {
                const exactDate = getExactDate(date, time)

                onSubmit(exactDate);
            })}>
                <FormField
                    control={control}
                    name='date'
                    render={({ field }) => (
                        <FormItem className='w-full mt-4'>
                            <div className='flex flex-wrap gap-4 items-center'>
                                <FormLabel className='font-bold'>
                                    <Translate namespace='Blogger' itemKey='publishdatedate' />
                                </FormLabel>

                                <p className='text-sm text-main/60 flex gap-1.5 items-center'>
                                    {format(fromDate, 'dd.MM.yyyy')}
                                    <ChevronRight size={18} />
                                    {format(toDate, 'dd.MM.yyyy')}
                                </p>
                            </div>

                            <SingleDatePicker
                                calendarProps={{
                                    disabled: [
                                        { before: fromDate, after: toDate },
                                        {
                                            before: new Date(),
                                            after: toDate
                                        }
                                    ]
                                }}
                                disabled={isLoading}
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='time'
                    render={({ field: { value, onChange } }) => (
                        <FormItem className='w-full mt-4'>
                            <div className='flex flex-wrap gap-4 items-center'>
                                <FormLabel className='font-bold'>
                                    <Translate namespace='Blogger' itemKey='publishdate' />
                                </FormLabel>

                                <p className='text-sm text-main/60 flex gap-1.5 items-center'>
                                    {format(fromDate, 'HH:mm')}
                                    <ChevronRight size={18} />
                                    {format(toDate, 'HH:mm')}
                                </p>
                            </div>

                            <div className='w-full flex justify-center'>
                                <TimePicker date={value} setDate={onChange} />
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {formData.date && formData.time && isValid ? (
                    <InfoMessage variant={'info'} className='mt-5 max-w-none w-full' size={'sm'}>
                        <Translate
                            namespace='Blogger.Requests-Page'
                            itemKey='exact-date'
                            values={{
                                date: format(formData.date, 'dd.MM.yyyy'),
                                time: format(formData.time, 'HH:mm')
                            }} />
                    </InfoMessage>
                ) : (
                    null
                )}


                <Button
                    disabled={isLoading}
                    type={'submit'}
                    className="font-bold mt-5 w-full !mx-auto"
                >
                    {isLoading && <SpinnerLoading className='mr-2' />}
                    <Translate namespace='Default' itemKey='accept' />
                </Button>
            </form>
        </Form>
    )
}

const getExactDate = (date: Date, time: Date) => {
    return new Date(
        date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()
    );
}

export default ExactDateForm
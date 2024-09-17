import Translate from '@/components/Translate';
import DateFormat from '@/components/date-format';
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
            date: z.date({ required_error: validationT("required-field" )}),
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
    const formValues = watch()

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
                            <div>
                                <FormLabel className='font-bold'><Translate namespace='Blogger' itemKey='publishdatedate' /></FormLabel>
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
                            <FormLabel className='font-bold'><Translate namespace='Blogger' itemKey='publishdate' /></FormLabel>

                            <div className='w-full flex justify-center'>
                                <TimePicker date={value} setDate={onChange} />
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {(isValid && formValues.date && formValues.time) ? (
                    <div className='text-sm mt-3 flex gap-2'>
                        Ви розмістите пост {' '}

                        <DateFormat date={getExactDate(formValues.date, formValues.time)} />
                    </div>
                ) : null}


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
'use client'

import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { TimePicker } from '@/components/ui/custom/time-picker/time-picker'
import DateRangePicker from '@/components/ui/date-pickers/range-date-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { type Blogger } from '@/database/blogger'
import { type BloggerPrices } from '@/socials/shared/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { MoveRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { type ZodType } from 'zod'
import Select from '../select'
import AdvertismentSelect from './advertisment-select'
import { type OrderPostFormData } from './order-post-form'
import { getBloggerPostTypes } from './utils'
import {getDiscountedPrice} from '@/utils/discount'
import { AdPostType } from '@/database/ad-post/post/post-types'

type Props = {
    blogger: Blogger;
    onSubmit?: (data: OrderPostFormData) => void
    isLoading?: boolean;
    schema: ZodType<OrderPostFormData>;
    initialPostType?: string | null;


}

const InstagramOrderPostForm = ({ blogger, onSubmit, isLoading, schema, initialPostType }: Props) => {


    const t = useTranslations("Catalogue")

    const form = useForm<OrderPostFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            postTime: {
                from: new Date(),
                to: new Date(),
            },
            advertismentType: initialPostType as AdPostType || undefined,
        }
    });


    const { handleSubmit, control, watch } = form;

    const selectePostType = watch('advertismentType');

    return (
        <>

            <Form {...form}>
                <form
                    className='w-[95%] md:w-full flex flex-col items-center'
                    onSubmit={handleSubmit(data => {
                        onSubmit?.(data);
                    })}
                >

                    <div className='grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 w-full mt-2'>
                        <FormField
                            control={control}
                            name='advertismentType'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <div>
                                        <FormLabel className='font-bold'><Translate namespace='Catalogue' itemKey='post-type' /></FormLabel>
                                    </div>

                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            placeholder={t('select-post-type')}
                                            onChange={field.onChange}
                                            items={
                                                getBloggerPostTypes(blogger)
                                                    .map(postType => ({
                                                        displayValue: <Translate namespace='Post-Types' itemKey={postType} />,
                                                        value: postType
                                                    }))
                                            }
                                            classNames={{
                                                content: 'w-[90vw] max-w-[460px] md:w-56 md:max-w-none'
                                            }}

                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='jsonAdvertisment'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <div>
                                        <FormLabel className='font-bold'><Translate namespace='Catalogue' itemKey='selectpost' /></FormLabel>
                                    </div>

                                    <AdvertismentSelect
                                        disabled={isLoading}
                                        blogger={blogger}
                                        postType={selectePostType}
                                        value={(JSON.parse(field.value ?? '{}') as any)?.id}
                                        onChange={(adv) => field.onChange(JSON.stringify(adv))}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>


                    <FormField
                        control={control}
                        name='postDate'
                        render={({ field }) => (
                            <FormItem className='w-full mt-4'>
                                <div>
                                    <FormLabel className='font-bold'><Translate namespace='Catalogue' itemKey="selectdata" /></FormLabel>
                                </div>

                                <FormControl>
                                    <DateRangePicker
                                        calendarProps={{
                                            disabled: [
                                                {
                                                    before: new Date()
                                                }
                                            ]
                                        }}
                                        disabled={isLoading}
                                        value={field.value}
                                        onChange={(dateRange) => {
                                            field.onChange(dateRange)
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='postTime'
                        render={({ field: { value, onChange } }) => (
                            <FormItem className='w-full mt-4'>
                                <div>
                                    <FormLabel className='font-bold'><Translate namespace='Catalogue' itemKey="selecthours" /></FormLabel>
                                </div>

                                <div className='flex justify-around w-full items-center'>
                                    <TimePicker date={value?.from} setDate={(date) => {
                                        onChange({ ...value, from: date })
                                    }} />

                                    <MoveRightIcon className='-mb-4 -ml-2' />

                                    <TimePicker date={value?.to} setDate={(date) => {
                                        onChange({ ...value, to: date })
                                    }} />
                                </div>
                                <FormMessage className='text-xs' />
                            </FormItem>
                        )}
                    />

                    <div className='w-full mt-4'>
                        <div className='w-full h-2 bg-yellow'></div>

                        <div className='font-bold flex items-center justify-between w-full text-sm'>
                            <h6>
                                <Translate namespace='Default' itemKey="price" />
                            </h6>

                            <div>

                               {
    selectePostType 
        ? (() => {
            const priceInfo = (blogger.prices as BloggerPrices)[selectePostType];
            if (!priceInfo) return <Translate namespace='Catalogue' itemKey='firstselectpost' />;
            
            const { amount, discount } = priceInfo;
            if (discount) {
                const discountedAmount = getDiscountedPrice(priceInfo);
                return discountedAmount + ' ₴';
            }
            return amount + ' ₴';
        })()
        : <Translate namespace='Catalogue' itemKey='firstselectpost' />
}


                            </div>
                        </div>
                    </div>

                    <Button disabled={isLoading} type='submit' className='mt-8' size={'lg'}>
                        {isLoading && <SpinnerLoading className='mr-2' />}

                        <Translate namespace='Catalogue' itemKey="orderpostshort" />
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default InstagramOrderPostForm
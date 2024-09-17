import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import TextEditor from '@/components/ui/custom/text-editor'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import equal from 'fast-deep-equal';
import { useZodSchema } from '@/hooks/use-zod-schema'
import { getSocialFormPricesSchema } from '@/schemas/advertisment'
import { MIN_ABOUT_LENGTH } from '../../constants'
import { createUnionSchema } from '@/lib/zod/create-many-union'
import MultipleSelect from '@/components/ui/custom/multiple-select'
import { TelegramAdPostType } from '@/database/ad-post/post/post-types'
import { type Category, categories } from '@/database/blogger/categories'
import { type TGChannelPrices } from '@/database/blogger/prices'
import TelegramAccountCard from '../tabs/telegram/telegram-account-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SubmitData = {
    about: string;
    categories?: Category[];
    prices: TGChannelPrices;
    womenPercentage?: number;
    menPercentage?: number;
    ageCategory?: string;
    cpm?: number;
    cpv?: number;
    channelAge?: number;
};

type TelegramBloggerFormData = {
    about: string;
    categories?: Category[];
    womenPercentage?: string;
    menPercentage?: string;
    ageCategory?: string;
    cpm?: string;
    cpv?: string;
    channelAge?: string;
    prices: Partial<Record<TelegramAdPostType, {
        price: string;
        discountValue?: string;
    }>>;
}

type Props = {
    isLoading?: boolean;
    onSubmit?: (data: SubmitData) => void;
    submitButtonText?: string;
    myTelegramProfile:
    {
        title: string | null;
        coverage: number | null;
        username: string | null;
        followersCount: number | null;
        channelId: string;
        photoUrl: string;
    } | null | undefined;
    
    defaultValues?: Partial<TelegramBloggerFormData>;
}

const TelegramBloggerForm = ({ defaultValues, onSubmit, submitButtonText, isLoading = false, myTelegramProfile }: Props) => {
    const t = useTranslations();
    const validationT = useTranslations('Validation');
    const schema = useZodSchema<TelegramBloggerFormData>(() => {
        return z.object({
            about: z.string()
                .min(MIN_ABOUT_LENGTH, validationT('min-length', { length: MIN_ABOUT_LENGTH }))
                .max(250, validationT('max-length'))
                .refine(value => {
                    const strippedContent = value
                        .replace(/<[^>]*>/g, '') 
                        .replace(/&nbsp;/g, ' ')  
                        .trim();
                    return strippedContent.length >= MIN_ABOUT_LENGTH;
                }, validationT('no-spaces-only')),
            prices: getSocialFormPricesSchema(validationT, Object.values(TelegramAdPostType)),
            categories: z.array(createUnionSchema(categories), { required_error: validationT('required-field') }),
            womenPercentage: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number')).optional()
                .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), validationT('percentage-range')),
            menPercentage: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number')).optional()
                .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), validationT('percentage-range')),
            ageCategory: z.string().optional(),
            cpm: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number')).optional(),
            cpv: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number')).optional(),
            channelAge: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number')).optional(),
        }).refine(data => {
            const womenPercentage = parseFloat(data.womenPercentage || '0');
            const menPercentage = parseFloat(data.menPercentage || '0');
            return womenPercentage + menPercentage <= 100;
        }, {
            message: validationT('percentageSumExceeds100'),
            path: ['menPercentage']
        });
    }, []);

    const form = useForm<TelegramBloggerFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            about: '',
            prices: Object.fromEntries(
                Object.values(TelegramAdPostType).map((postType) => ([
                    postType,
                    {
                        price: '',
                        discountValue: '',
                    }
                ]))
            ),
            ...defaultValues
        }
    })
    const { control, handleSubmit, watch, formState: { errors } } = form;

    const handleFormSubmit = async (data: TelegramBloggerFormData) => {
        console.log('Form data before formatting:', data);
        const formattedData = formatFormData(data);
        console.log('Formatted data:', formattedData);
        onSubmit?.(formattedData);
    };

    return (
        <div>
            <Form {...form}>
                <form className='max-w-[600px]' onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="mb-8">
                        <h2 className="font-bold uppercase mb-2">{t("Blogger.channel")}</h2>
                        <TelegramAccountCard
                            followersCount={myTelegramProfile?.followersCount ?? 0}
                            image={myTelegramProfile?.photoUrl ?? ""}
                            username={myTelegramProfile?.title ?? ""}
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="font-bold uppercase mb-2"><Translate namespace="Blogger" itemKey="price" /></h2>
                        {Object.values(TelegramAdPostType).map((postType) => (
                            <div key={postType} className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                                <FormInput 
                                    disabled={isLoading} 
                                    label={`${t(`Post-Types.${postType}`)} `} 
                                    labelRight={<span className='text-rose-600'>*</span>}
                                    control={control} 
                                    name={`prices.${postType}.price`} 
                                />
                                <FormInput 
                                    disabled={isLoading} 
                                    label={`${t(`Post-Types.${postType}`)} ${t('Blogger.discount')}`}
                                    control={control} 
                                    name={`prices.${postType}.discountValue`} 
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mb-8">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <FormInput disabled={isLoading} label={t("Blogger.womenPercentage")} control={control} name="womenPercentage" />
                            <FormInput disabled={isLoading} label={t("Blogger.menPercentage")} control={control} name="menPercentage" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <FormField
                            control={control}
                            name='ageCategory'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">
                                        <Translate namespace='Blogger' itemKey='ageCategory' />
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Blogger.selectAge')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="13-17">13-17</SelectItem>
                                                <SelectItem value="18-24">18-24</SelectItem>
                                                <SelectItem value="25-34">25-34</SelectItem>
                                                <SelectItem value="35-44">35-44</SelectItem>
                                                <SelectItem value="45+">45+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mb-8">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <FormInput disabled={isLoading} label={t("Blogger.cpm")} control={control} name="cpm" />
                            <FormInput disabled={isLoading} label={t("Blogger.cpv")} control={control} name="cpv" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <FormInput disabled={isLoading} label={t("Blogger.channelAge")} control={control} name="channelAge" />
                    </div>

                    <h4 className="font-bold uppercase mb-4"><Translate namespace="Blogger" itemKey="aboutchannel" /></h4>

                    <div className='mb-5'>
                        <FormField
                            control={control}
                            name='categories'
                            render={({ field }) => (
                                <FormItem className='mb-8'>
                                    <FormLabel className='font-bold'><Translate namespace='Labels' itemKey='categories' /></FormLabel>

                                    <FormControl>
                                        <MultipleSelect
                                            classNames={{
                                                content: 'max-w-[600px] w-[90vw]'
                                            }}
                                            placeholder={t('Labels.category')}
                                            value={field.value}
                                            onChange={(value) => {
                                                if (!value) return;
                                                field.onChange(value);
                                            }}
                                            items={categories.map(category => ({
                                                value: category,
                                                displayValue: <Translate namespace='Categories' itemKey={category} />
                                            }))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mb-8">
                        <FormField
                            control={control}
                            name='about'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">{t("Blogger.aboutchannel")}
                                        <span className='text-rose-600'> *</span>
                                    </FormLabel>
                                    <FormControl>
                                        <TextEditor disabled={isLoading} onChange={field.onChange} value={field.value} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <Button type='submit' disabled={isLoading || equal(watch(), defaultValues)}>
                            {isLoading && <SpinnerLoading className="mr-2" />}
                            {submitButtonText ?? <Translate namespace="Advertiser" itemKey="sendmoderation" />}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}


const formatFormData = (data: TelegramBloggerFormData): SubmitData => {
    console.log('Input data:', data);

    const result: SubmitData = {
        about: data.about,
        prices: Object.fromEntries(
            Object.entries(data.prices)
                .filter(([_, priceData]) => priceData.price && priceData.price.trim() !== '')
                .map(([postType, priceData]) => {
                    const price = parseFloat(priceData.price);
                    if (isNaN(price)) {
                        return [postType, null];
                    }
                    const discount = priceData.discountValue 
                        ? {
                            type: 'percentage' as const,
                            value: parseFloat(priceData.discountValue)
                        } 
                        : undefined;
                    return [postType, { amount: price, discount }];
                })
                .filter(([_, value]) => value !== null)
        ),
        categories: data.categories,
        womenPercentage: data.womenPercentage ? parseFloat(data.womenPercentage) : undefined,
        menPercentage: data.menPercentage ? parseFloat(data.menPercentage) : undefined,
        ageCategory: data.ageCategory || undefined,
        cpm: data.cpm ? parseFloat(data.cpm) : undefined,
        cpv: data.cpv ? parseFloat(data.cpv) : undefined,
        channelAge: data.channelAge ? parseFloat(data.channelAge) : undefined,
    };

    console.log('Formatted data:', result); 

    return result;
};

export default TelegramBloggerForm

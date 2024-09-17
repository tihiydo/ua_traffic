'use client';

import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import DeleteButton from '../delete-button';
import ChannelCard from '../account-card';
import TextEditor from '@/components/ui/custom/text-editor'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useErrorTranslate } from '@/hooks/use-error';
import FormInput from '@/components/ui/custom/form/form-input';
import { z } from 'zod';
import { getSocialFormPricesSchema } from '@/schemas/advertisment';
import { useZodSchema } from '@/hooks/use-zod-schema';
import { useForm } from 'react-hook-form';
import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import equal from 'fast-deep-equal';
import { InstagramAdPostType } from '@/database/ad-post/post/post-types';
import { type IGBlogger } from '@/database/blogger';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type InstagramBloggerFormData = {
    about: string;
    prices: Partial<Record<InstagramAdPostType, {
        price: string;
        discountValue?: string;
    }>>;
    womenPercentage?: string;
    menPercentage?: string;
    ageCategory?: string;
    cpm?: string;
    cpv?: string;
    channelAge?: string;
}

type Props = {
    channel: IGBlogger;
}

const MIN_ABOUT_LENGTH = 30;

const InstagramBloggerEditForm = ({ channel }: Props) => {
    const { push } = useRouter();
    const utils = api.useUtils();
    const translateError = useErrorTranslate();
    const t = useTranslations();
    const instagramAdPostTypeValues = ['story', 'story-tech-task'] as const;
    const validationT = useTranslations('Validation');
    const schema = useZodSchema<InstagramBloggerFormData>(() => {
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


            prices: z.record(
                z.enum(instagramAdPostTypeValues), 
                z.object({
                    price: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number')),
                    discountValue: z.string().regex(/^\d*\.?\d*$/, validationT('invalid-number'))
                        .refine(val => !val || (parseFloat(val) >= 1 && parseFloat(val) <= 99), validationT('percentage-range-1-99'))
                        .optional(),
                })
            ),
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

    const defaultValues: InstagramBloggerFormData = {
        about: channel.about,
        prices: Object.fromEntries(
            Object.values(InstagramAdPostType).map((postType) => ([
                postType,
                {
                    price: channel.prices[postType]?.amount?.toString() ?? '',
                    discountValue: channel.prices[postType]?.discount?.value?.toString() ?? '',
                }
            ]))
        ),
        womenPercentage: channel.womenPercentage?.toString() ?? '',
        menPercentage: channel.menPercentage?.toString() ?? '',
        ageCategory: channel.ageCategory ?? undefined,
        cpm: channel.cpm?.toString() ?? '',
        cpv: channel.cpv?.toString() ?? '',
        channelAge: channel.channelAge?.toString() ?? '',
    }

    const form = useForm<InstagramBloggerFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues
    })
    const { control, handleSubmit, watch, formState: { isValid, errors } } = form;
    const { mutateAsync: updateBlogger, isLoading } = api.blogger.updateBlogger.useMutation({
        onSuccess: () => {
            utils.blogger.getBlogger.invalidate({ bloggerId: channel.id });
            toast.success(t('Other.update'));
            push('/blogger/my-channels')
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    return (
        <>
            <div className='mb-3'>
                <ChannelCard username={channel.username} image={channel.profilePicture} followersCount={channel.followersCount} />
            </div>

            <Form {...form}>
                <form className='max-w-[600px]' onSubmit={handleSubmit((async (data) => {
                    const formatedData = formatFormData(data);

                    updateBlogger({
                        bloggerId: channel.id,
                        data: formatedData
                    })
                }))}>
                    <div className="mb-8">
                        <h2 className="font-bold uppercase mb-2"><Translate namespace="Blogger" itemKey="price" /></h2>
                        {Object.values(InstagramAdPostType).map((postType) => (
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

                  

                    <div className="mb-8">
                        <FormField
                            control={control}
                            name='about'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">
                                        <Translate namespace='Blogger' itemKey='aboutchannel' />
                                        <span className='text-rose-600'> *</span>
                                    </FormLabel>
                                    <FormControl>
                                        <TextEditor disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <Button className='mr-2' type='submit' disabled={isLoading || !isValid || equal(watch(), defaultValues)}>
                            {isLoading && <SpinnerLoading className="mr-2" />}
                            <Translate namespace='Default' itemKey='update' />
                        </Button>
                        <DeleteButton bloggerId={channel.id} />
                    </div>
                </form>
            </Form>
        </>
    )
}

const formatFormData = (data: InstagramBloggerFormData) => ({
    about: data.about,
    prices: Object.fromEntries(Object.entries(data.prices).map(([postType, priceData]) => {
        const price = parseFloat(priceData.price);
        const discount = priceData.discountValue 
            ? {
                type: 'percentage' as const,
                value: parseFloat(priceData.discountValue)
            } 
            : undefined;
        return [postType, { amount: price, discount }];
    })),
    womenPercentage: data.womenPercentage ? parseFloat(data.womenPercentage) : undefined,
    menPercentage: data.menPercentage ? parseFloat(data.menPercentage) : undefined,
    ageCategory: data.ageCategory || undefined,
    cpm: data.cpm ? parseFloat(data.cpm) : undefined,
    cpv: data.cpv ? parseFloat(data.cpv) : undefined,
    channelAge: data.channelAge ? parseFloat(data.channelAge) : undefined,
})

export default InstagramBloggerEditForm
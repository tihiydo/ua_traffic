'use client'

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import MultipleSelect from '@/components/ui/custom/multiple-select';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from '@/i18n/navigation';
import { createUnionSchema } from '@/lib/zod/create-many-union';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BloggerTag } from '@prisma/client';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { type Blogger } from '@/database/blogger'
import { categories } from '@/database/blogger/categories';
import TextEditor from '@/components/ui/custom/text-editor';
import FormInput from '@/components/ui/custom/form/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    blogger: Blogger;
}

const schema = z.object({
    categories: z.array(createUnionSchema(categories)).optional(),
    tags: z.array(z.nativeEnum(BloggerTag)).optional(),
    about: z.string().min(30, 'Опишіть свій канал більш детальніше (більш ніж на 30 символів)').max(250, 'Опишіть свій канал менш детальніше (менш ніж на 250 символів)').refine(value => {
        const strippedContent = value
            .replace(/<[^>]*>/g, '') 
            .replace(/&nbsp;/g, ' ')  
            .trim();
        return strippedContent.length >= 30;
    }
    ),
    rating: z.string().optional(),
    womenPercentage: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional()
        .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), 'Введіть число від 0 до 100'),
    menPercentage: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional()
        .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), 'Введіть число від 0 до 100'),
    ageCategory: z.string().optional(),
    cpm: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional(),
    cpv: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional(),
    channelAge: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional(),
}).refine(data => {
    const womenPercentage = parseFloat(data.womenPercentage || '0');
    const menPercentage = parseFloat(data.menPercentage || '0');
    return womenPercentage + menPercentage <= 100;
}, {
    message: 'Сума відсотків не може перевищувати 100',
    path: ['menPercentage'],
})
type EditBloggerFormData = z.infer<typeof schema>

const EditBloggerForm = ({ blogger }: Props) => {
    const router = useRouter();
    const editBlogger = api.admin.blogger.editBlogger.useMutation({
        onSuccess: () => {
            toast.success('Оновлено успішно')
            router.push('/admin/moderation/bloggers')
        }
    });

    const form = useForm<EditBloggerFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            tags: blogger.tags ?? undefined,
            categories: blogger.categories,
            about: blogger.about,
            womenPercentage: blogger.womenPercentage?.toString() ?? '',
            menPercentage: blogger.menPercentage?.toString() ?? '',
            ageCategory: blogger.ageCategory ?? undefined,
            cpm: blogger.cpm?.toString() ?? '',
            cpv: blogger.cpv?.toString() ?? '',
            channelAge: blogger.channelAge?.toString() ?? '',
            rating: blogger.rating?.toString() ?? '',
        }
    })
    const { control, handleSubmit } = form;

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit((data) => {
                    editBlogger.mutate({
                        bloggerId: blogger.id,
                        categories: data.categories,
                        tags: data.tags,
                        about: data.about,
                        womenPercentage: data.womenPercentage ? parseFloat(data.womenPercentage) : undefined,
                        menPercentage: data.menPercentage ? parseFloat(data.menPercentage) : undefined,
                        ageCategory: data.ageCategory,
                        cpm: data.cpm ? parseFloat(data.cpm) : undefined,
                        cpv: data.cpv ? parseFloat(data.cpv) : undefined,
                        channelAge: data.channelAge ? parseFloat(data.channelAge) : undefined,
                        rating: data.rating ? parseFloat(data.rating) : undefined,
                    })
                })}
            >
                <FormField
                    disabled={editBlogger.isLoading}
                    control={control}
                    name='categories'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="mb-2 block font-bold">Оберіть категорії</FormLabel>

                            <FormControl>
                                <MultipleSelect
                                    disabled={editBlogger.isLoading}
                                    value={field.value}
                                    onChange={(values) => {
                                        if (!values) return;
                                        field.onChange(values)
                                    }}
                                    items={categories.map(category => ({
                                        displayValue: <Translate itemKey={category} namespace='Categories' />,
                                        value: category
                                    }))}
                                    placeholder="Категорії каналу..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    disabled={editBlogger.isLoading}
                    control={control}
                    name='tags'
                    render={({ field }) => (
                        <FormItem className='mt-5'>
                            <FormLabel className="mb-2 block font-bold">Оберіть тег</FormLabel>

                            <FormControl>
                                <MultipleSelect
                                    disabled={editBlogger.isLoading}
                                    classNames={{ content: 'max-w-[600px] w-[90vw]' }}
                                    value={field.value}
                                    onChange={(tags) => {
                                        field.onChange(tags)
                                    }}
                                    items={Object.values(BloggerTag).map((tag) => ({
                                        displayValue: <Translate itemKey={tag} namespace='Blogger-Tags' />,
                                        value: tag
                                    }))}
                                    placeholder="Тег каналу..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput disabled={editBlogger.isLoading} label="Відсоток жінок" control={control} name="womenPercentage" />
                    <FormInput disabled={editBlogger.isLoading} label="Відсоток чоловіків" control={control} name="menPercentage" />
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput disabled={editBlogger.isLoading} label="Вік каналу" control={control} name="channelAge" />
                </div>

                <FormField
                    control={control}
                    name='ageCategory'
                    render={({ field }) => (
                        <FormItem className="mt-5">
                            <FormLabel className="font-bold">Вікова категорія</FormLabel>
                            <FormControl>
                                <Select
                                    disabled={editBlogger.isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Оберіть вікову категорію" />
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

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput disabled={editBlogger.isLoading} label="CPM" control={control} name="cpm" />
                    <FormInput disabled={editBlogger.isLoading} label="CPV" control={control} name="cpv" />
                </div>

                <FormInput 
                    disabled={editBlogger.isLoading} 
                    label="Рейтинг блоггера" 
                    control={control} 
                    name="rating" 
                />

                <FormField
                    control={control}
                    name='about'
                    render={({ field }) => (
                        <FormItem className="mt-5">
                            <FormLabel className="font-bold">Про канал
                                <span className="text-rose-600"> *</span>
                            </FormLabel>
                            <FormControl>
                                <TextEditor
                                    height={300}
                                    disabled={editBlogger.isLoading}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type='submit'
                    className='mt-8'
                    disabled={editBlogger.isLoading}
                >
                    {editBlogger.isLoading && (
                        <SpinnerLoading className='mr-2' />
                    )}
                    Оновити
                </Button>
            </form>
        </Form>
    )
}

export default EditBloggerForm
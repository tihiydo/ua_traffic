
'use client'

import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import TextEditor from '@/components/ui/custom/text-editor'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import { api } from '@/trpc/react'
import { allowedFiles, allowedImgs } from '@/constants/mime-types'
import FileInput from '@/components/ui/custom/form/file-input'
import { uploadFiles } from '@/lib/vercel-blob'
import { toast } from 'react-toastify'
import { categories, bloggerCategoriesSchema } from '@/database/blogger/categories'
import { BloggerTag } from '@prisma/client'
import MultipleSelect from '@/components/ui/custom/multiple-select'
import { IGFormPricesSchema } from '@/database/blogger/prices/form-schemas'
import { type Blogger } from '@/database/blogger'
import { type IGBloggerPrices } from '@/database/blogger/prices'
import { useRouter } from '@/i18n/navigation'
import { InstagramAdPostType } from '@/database/ad-post/post/post-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


type InstagramFormData = z.infer<typeof schema>;
const schema = z.object({
    about: z.string().min(30, 'Опишіть свій канал більш детальніше (більш ніж на 30 символів)').max(250, 'Опишіть свій канал менш детальніше (менш ніж на 250 символів)').refine(value => {
        const strippedContent = value
            .replace(/<[^>]*>/g, '') 
            .replace(/&nbsp;/g, ' ')  
            .trim();
        return strippedContent.length >= 30;
    }
    ),
    followersCount: z.string().min(1, 'Кількість підписників повинно бути заповненно'),
    username: z.string().min(1, 'Юзернейм повинно бути заповненно'),
    prices: z.record(z.enum(['story', 'story-tech-task']), z.object({
        price: z.string(),
        discountValue: z.string().optional()
    })),
    categories: bloggerCategoriesSchema,
    tags: z.array(z.nativeEnum(BloggerTag)),
    rating: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional(),
    womenPercentage: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional()
        .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), 'Введіть число від 0 до 100'),
    menPercentage: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional()
        .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100), 'Введіть число від 0 до 100'),
    ageCategory: z.string().optional(),
    cpm: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional(),
    cpv: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').optional(),
    channelAge: z.string().regex(/^\d*\.?\d*$/, 'Введіть коректне число').refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) < 100), 'Введіть число від 0 до 100').optional().nullable(),
}).refine(data => {
    const womenPercentage = parseFloat(data.womenPercentage || '0');
    const menPercentage = parseFloat(data.menPercentage || '0');
    return womenPercentage + menPercentage <= 100;
}, {
    message: 'Сума відсотків не може перевищувати 100',
    path: ['menPercentage'],
})
type Props = {
    blogger: Blogger;
    isLoading?: boolean;
}

const InstagramForceBloggerEditForm = ({ blogger, isLoading = false }: Props) => {
    const router = useRouter();
    const editBlogger = api.admin.blogger.editForceBlogger.useMutation({
        onSuccess: () => {
            toast.success('Оновлено успішно')
            router.push('/admin/moderation/bloggers')
        }
    });
    const [photo, setPhoto] = useState<string | null>(blogger.profilePicture)


    const form = useForm<InstagramFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            about: blogger.about,
            followersCount: blogger.followersCount.toString(),
            username: blogger.username,
            categories: blogger.categories,
            tags: blogger.tags,
            prices: Object.fromEntries(
                Object.entries(blogger.prices)
                    .map(([key, val]) => ([
                        key,
                        {
                            price: val.amount?.toString() || '',
                            discountValue: val.discount?.value?.toString() || ''
                        }
                    ]))
            ),
            womenPercentage: blogger.womenPercentage?.toString() || '',
            menPercentage: blogger.menPercentage?.toString() || '',
            ageCategory: blogger.ageCategory || undefined,
            cpm: blogger.cpm?.toString() || '',
            cpv: blogger.cpv?.toString() || '',
            channelAge: blogger.channelAge?.toString() || null,
            rating: blogger.rating?.toString() || '',

        },
    })
    const { control, handleSubmit, formState: { errors,  } } = form;
    const t = useTranslations();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const loadFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!selectedFiles.length) {
            throw new Error('No file selected');
        }

        const blobs = await uploadFiles(`post`, selectedFiles, allowedFiles)

        setPhoto(blobs[0]?.url || null);
        toast.info("Фото завантаженно")
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit((async (data) => {
                editBlogger.mutate({
                    bloggerId: blogger.id,
                    about: data.about,
                    username: data.username,
                    categories: data.categories,
                    followers: data.followersCount ? parseInt(data.followersCount) : 0,
                    prices: Object.fromEntries(
                        Object.entries(data.prices).map(([key, value]) => [
                            key,
                            {
                                amount: parseFloat(value.price),
                                discount: value.discountValue ? {
                                    value: parseFloat(value.discountValue),
                                    type: 'percentage' as const
                                } : undefined
                            }
                        ])
                    ),
                    profilePic: photo ?? undefined,
                    tags: data.tags,
                    womenPercentage: data.womenPercentage ? parseFloat(data.womenPercentage) : undefined,
                    menPercentage: data.menPercentage ? parseFloat(data.menPercentage) : undefined,
                    ageCategory: data.ageCategory ?? undefined,
                    cpm: data.cpm ? parseFloat(data.cpm) : undefined,
                    cpv: data.cpv ? parseFloat(data.cpv) : undefined,
                    channelAge: data.channelAge ? parseInt(data.channelAge) : undefined,
                    rating: data.rating ? parseInt(data.rating) : undefined,
                })
            }))}>
                <div className="mb-8">
                    <FormField
                        name='categories'
                        control={control}
                        render={({ field }) => (
                            <FormItem className='mt-4'>
                                <FormLabel className='block font-bold text-sm mb-2'>
                                    Виберіть категорії
                                </FormLabel>

                                <FormControl>
                                    <MultipleSelect
                                        disabled={editBlogger.isLoading}
                                        value={field.value}
                                        onChange={(value) => {
                                            if (!value) return;
                                            field.onChange(value)
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
                        name='tags'
                        control={control}
                        render={({ field }) => (
                            <FormItem className='mt-4'>
                                <FormLabel className='block font-bold text-sm mb-2'>
                                    Виберіть теги
                                </FormLabel>

                                <FormControl>
                                    <MultipleSelect
                                        disabled={editBlogger.isLoading}
                                        value={field.value}
                                        onChange={(value) => {
                                            if (!value) return;
                                            field.onChange(value)
                                        }}
                                        items={Object.values(BloggerTag).map(tag => ({
                                            displayValue: <Translate itemKey={tag} namespace='Blogger-Tags' />,
                                            value: tag
                                        }))}
                                        placeholder="Теги каналу..."
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className={`${photo ? 'hidden' : ''}`}>
                        <h2 className="font-bold text-sm mt-4">Завантажте фото профілю канала</h2>
                        <div className='flex mt-2 mb-4'>
                            <FileInput acceptedTypes={allowedImgs} onChange={(files) => {
                                setSelectedFiles(files);
                            }} />
                            <Button variant={"success"} className='ml-3 self-center' onClick={async (e) => {
                                await loadFile(e);
                            }}>Завантажити</Button>
                        </div>
                    </div>
                    {
                        photo &&
                        <>
                            <h2 className="font-bold text-sm mb-2 mt-2">Ваше фото каналу</h2>
                            <div className='bg-[#f4f4f4] w-fit rounded-lg'>
                                <img src={photo} alt="Аватарка" className='rounded-full p-2 w-[100px] h-[100px]'></img>
                            </div>
                        </>
                    }
                    <FormInput type="number"  disabled={editBlogger.isLoading} label="Кількість підписників" control={control} name={`followersCount`} />
                    <FormInput disabled={editBlogger.isLoading} label="Нікнейм в інстаграмі" control={control} name={`username`} />

                    <h1 className='font-bold mt-5 mb-5'>
                    ДОДАТКОВА ІНФОРМАЦІЯ
                    </h1>

                    <FormInput
                        type="number"  
                        disabled={editBlogger.isLoading} 
                        label="% жіночої аудиторії" 
                        control={control} 
                        name="womenPercentage" 
                    />
                    <FormInput
                        type="number"  
                        disabled={editBlogger.isLoading} 
                        label="% чоловічої аудиторії" 
                        control={control} 
                        name="menPercentage" 
                        
                    />
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
                    <FormInput 
                        type="number" 
                        disabled={editBlogger.isLoading} 
                        label="CPM" 
                        control={control} 
                        name="cpm" 
                    />
                    <FormInput 
                        type="number" 
                        disabled={editBlogger.isLoading} 
                        label="CPV" 
                        control={control} 
                        name="cpv" 
                    />
                    <FormInput 
                        type="number" 
                        disabled={editBlogger.isLoading} 
                        label="Вік каналу" 
                        control={control} 
                        name="channelAge" 
                    />
                    <FormInput 
                        type="number" 
                        disabled={editBlogger.isLoading} 
                        label="Рейтинг блоггера" 
                        control={control} 
                        name="rating" 
                    />
                    <h2 className="font-bold uppercase mb-2 mt-6"><Translate namespace="Blogger" itemKey="price" /></h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {Object.values(InstagramAdPostType).map(postType => (
                            <React.Fragment key={postType}>
                                <FormInput
                                    disabled={editBlogger.isLoading}
                                    placeholder='1000'
                                    label={`${t(`Post-Types.${postType}`)}`}
                                    labelRight={<span className='text-rose-600'> *</span>}
                                    control={control}
                                    name={`prices.${postType}.price`}
                                    onKeyDown={
                                        (e) => {
                                            if (!/^\d+$/.test(e.key) && e.key !== 'Backspace') {
                                                e.preventDefault();
                                            }
                                        }
                                    }
                                />
                            </React.Fragment>
                        ))}
                    </div>

                    <div>
                        {errors.prices?.message}
                    </div>
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
                                    <TextEditor disabled={editBlogger.isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <Button type='submit' disabled={editBlogger.isLoading}>
                        {editBlogger.isLoading && <SpinnerLoading className="mr-2" />}
                        Підтвердити
                    </Button>
                </div>
            </form>
        </Form>
    )
}


export default InstagramForceBloggerEditForm
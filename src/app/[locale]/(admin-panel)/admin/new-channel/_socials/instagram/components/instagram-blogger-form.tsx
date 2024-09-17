'use client'

import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import TextEditor from '@/components/ui/custom/text-editor'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import equal from 'fast-deep-equal';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import { api } from '@/trpc/react'
import ComboBox from '@/components/ui/combo-box'
import { allowedFiles, allowedImgs } from '@/constants/mime-types'
import FileInput from '@/components/ui/custom/form/file-input'
import { uploadFiles } from '@/lib/vercel-blob'
import { toast } from 'react-toastify'
import { v4 } from 'uuid';
import { type Category, categories } from '@/database/blogger/categories'
import { type BloggerStatus } from '@prisma/client'
import MultipleSelect from '@/components/ui/custom/multiple-select'
import { type IGBloggerPrices } from '@/database/blogger/prices'
import { IGFormPricesSchema } from '@/database/blogger/prices/form-schemas'


type SubmitData = {
    about: string;
    prices: IGBloggerPrices;
    username: string;
    followersCount: number;
    userId: string;
    categories: Category[]
    status: BloggerStatus;
    id: string;
    profilePicture: string;
}

type InstagramFormData = z.infer<typeof schema>;
const schema = z.object({
    about: z.string().min(30, 'Опишіть свій канал більш детальніше (більш ніж на 30 символів)'),
    followersCount: z.string().min(1, 'Кількість підписників повинно бути заповненно'),
    username: z.string().min(1, 'Юзернейм повинно бути заповненно'),
    prices: IGFormPricesSchema
})

type Props = {
    onSubmit?: (data: SubmitData) => void;
    isLoading?: boolean;
    submitButtonText?: string;
    defaultValues?: Partial<InstagramFormData>;
}




const InstagramBloggerForm = ({ defaultValues, onSubmit, submitButtonText, isLoading = false }: Props) => {
    const { data: users } = api.admin.users.getUsers.useQuery();
    const [selectedUser, setUser] = useState('admin')
    const [photo, setPhoto] = useState<string | null>()

    const form = useForm<InstagramFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues:
        {
            about: '',
            followersCount: '0',
            username: '',
            prices:
            {
                story: '',
                'story-tech-task': '',
            },
            ...defaultValues
        }
    })
    const { control, handleSubmit, watch, formState: { isValid, errors } } = form;
    const t = useTranslations();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [categoriesState, setCategoriesState] = useState<Category[]>([]);

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
                const editableData = formatFormData(data, photo || "", (users?.find(el => el?.email?.trim()?.toLowerCase() == selectedUser)?.id) || "ADMIN", categoriesState);
                await onSubmit?.(editableData);
            }))}>
                <div className="mb-8">
                    <h2 className="font-bold text-sm mb-2">Виберіть користувача</h2>
                    <ComboBox
                        value={selectedUser.trim()}
                        onSelect={(user) => {
                            setUser(user.trim().toLowerCase())
                        }}
                        items=
                            {
                                users ? users.map(user =>
                                    ({
                                        label: user.email ? user.email.trim().toLowerCase() : '',
                                        value: user.email ? user.email.trim().toLowerCase() : ''
                                    })) : []
                            }
                        placeholder="Виберіть користувача.."
                    />
                    <h2 className="font-bold text-sm mb-2 mt-4">Виберіть категорії</h2>
                    <MultipleSelect
                        value={categoriesState}
                        onChange={(value) => {
                            if (!value) return;
                            setCategoriesState(value);
                        }}
                        items={categories.map(category => ({
                            displayValue: <Translate itemKey={category} namespace='Categories' />,
                            value: category
                        }))}
                        placeholder="Категорії каналу..."
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
                    <FormInput disabled={isLoading} label="Кількість підписників" control={control} name={`followersCount`} />
                    <FormInput disabled={isLoading} label="Нікнейм в інстаграмі" control={control} name={`username`} />
                    <h2 className="font-bold uppercase mb-2 mt-6"><Translate namespace="Blogger" itemKey="price" /></h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <FormInput disabled={isLoading} label={t("Post-Types.story")} control={control} name={`prices.story`} />
                        <FormInput disabled={isLoading} label={t("Post-Types.story-tech-task")} control={control} name={`prices.story-tech-task`} />
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
                                <FormLabel className="font-bold">{t("Blogger.aboutchannel")}</FormLabel>
                                <FormControl>
                                    <TextEditor disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <Button type='submit' disabled={isLoading || !isValid || equal(watch(), defaultValues)}>
                        {isLoading && <SpinnerLoading className="mr-2" />}
                        {submitButtonText ?? "Створити канал"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

const formatFormData = (data: InstagramFormData, photo: string, userId: string, categories: Category[]): SubmitData => ({
    about: data.about,
    followersCount: data.followersCount ? parseInt(data.followersCount) : 0,
    profilePicture: photo,
    username: data.username ? data.username : '',
    userId,
    categories,
    id: v4(),
    status: "Active",
    prices:
    {
        story: data.prices.story ?{amount: parseFloat(data.prices.story)} : undefined,
        'story-tech-task': data.prices['story-tech-task'] ? {amount: parseFloat(data.prices['story-tech-task'])} : undefined,
    }
})

export default InstagramBloggerForm
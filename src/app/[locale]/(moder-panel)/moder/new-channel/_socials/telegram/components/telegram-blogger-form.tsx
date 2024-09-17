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
import ComboBox from '@/components/ui/combo-box'
import { api } from '@/trpc/react'
import FileInput from '@/components/ui/custom/form/file-input'
import { allowedImgs } from '@/constants/mime-types'
import { uploadFiles } from '@/lib/vercel-blob'
import { toast } from 'react-toastify'
import { type Category, categories } from '@/database/blogger/categories'
import MultipleSelect from '@/components/ui/custom/multiple-select'
import { TelegramAdPostType } from '@/database/ad-post/post/post-types'
import { type TGChannelPrices } from '@/database/blogger/prices'
import { TGFormPricesSchema } from '@/database/blogger/prices/form-schemas'


type SubmitData = {
    about: string;
    username: string;
    followersCount: number;
    prices: TGChannelPrices;
    profilePicture: string;
    userId: string;
    categories: Category[];
    cpm?: number;
    cpv?: number;
    channelAge?: number;
    womenPercentage?: number;
    menPercentage?: number;
    ageCategory?: string;
}
type TelegramFormData = z.infer<typeof schema>;
const schema = z.object({
    about: z.string().min(258, 'Опишіть свій канал більш детальніше (більш ніж на 250 символів)'),
    followersCount: z.string().min(1, 'Кількість підписників повинно бути заповненно'),
    username: z.string().min(1, 'Юзернейм повинно бути заповненно'),
    prices: TGFormPricesSchema,
    womenPercentage: z.string().regex(/^\d*\.?\d*$/).optional()
        .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100)),
    menPercentage: z.string().regex(/^\d*\.?\d*$/).optional()
        .refine(val => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100)),
    ageCategory: z.string().optional(),
    cpm: z.string().regex(/^\d*\.?\d*$/).optional(),
    cpv: z.string().regex(/^\d*\.?\d*$/).optional(),
    channelAge: z.string().regex(/^\d*\.?\d*$/).optional(),
}).refine(data => {
    const womenPercentage = parseFloat(data.womenPercentage || '0');
    const menPercentage = parseFloat(data.menPercentage || '0');
    return womenPercentage + menPercentage <= 100;
}, {
    message:('percentageSumExceeds100'),
    path: ['menPercentage']
})

type Props = {
    isLoading?: boolean;
    onSubmit?: (data: SubmitData) => void;
    submitButtonText?: string;
    defaultValues?: Partial<TelegramFormData>;
}

const TelegramBloggerForm = ({ defaultValues, onSubmit, submitButtonText, isLoading = false }: Props) => {
    const { data: users } = api.admin.users.getUsers.useQuery();
    const [selectedUser, setUser] = useState('admin')
    const [photo, setPhoto] = useState<string | null>()
    const form = useForm<TelegramFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            about: '',
            followersCount: '0',
            username: '',
            prices: {
                'no-deletion': '',
                'post-1x24': '',
                'post-2x48': '',
                'post-3x72': '',
                'post-30x24': '',
            },
            ...defaultValues
        }
    })
    const t = useTranslations();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [categoriesState, setCategoriesState] = useState<Category[]>([]);

    const loadFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!selectedFiles.length) {
            throw new Error('No file selected');
        }

        const blobs = await uploadFiles(`post`, selectedFiles, allowedImgs)

        setPhoto(blobs[0]?.url || null);
        toast.info("Фото завантаженно")
    }
    const { control, handleSubmit, watch, formState: { isValid, errors } } = form;

    return (

        <Form {...form}>
            <form onSubmit={handleSubmit((async (data) => {
                const editableData = formatFormData(
                    data,
                    photo || "",
                    (users?.find(el => el?.email?.trim()?.toLowerCase() == selectedUser)?.id) || "ADMIN",
                    categoriesState
                );
                onSubmit?.(editableData);
            }))}>
                <div className="mb-8">
                    <h2 className="font-bold text-sm mb-2">Виберіть користувача</h2>
                    <ComboBox
                        value={selectedUser.trim()}
                        onSelect={(user) => {
                            setUser(user.trim().toLowerCase())
                        }}
                        items={users
                            ? users.map(user => ({
                                label: user.email ? user.email.trim().toLowerCase() : '',
                                value: user.email ? user.email.trim().toLowerCase() : ''
                            }))
                            : []
                        }
                        placeholder="Виберіть користувача.."
                    />
                    <h2 className="font-bold text-sm mb-2 mt-4">Виберіть категорію</h2>
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
                    <FormInput disabled={isLoading} label="Нікнейм в телеграмі" control={control} name={`username`} />
                    <h2 className="font-bold uppercase mb-2 mt-6"><Translate namespace="Blogger" itemKey="price" /></h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <FormInput disabled={isLoading} label={t("Post-Types.no-deletion")} control={control} name={`prices.no-deletion`} />
                        <FormInput disabled={isLoading} label={t("Post-Types.post-1x24")} control={control} name={`prices.post-1x24`} />
                        <FormInput disabled={isLoading} label={t("Post-Types.post-2x48")} control={control} name={`prices.post-2x48`} />
                        <FormInput disabled={isLoading} label={t("Post-Types.post-3x72")} control={control} name={`prices.post-3x72`} />
                        <FormInput disabled={isLoading} label={t("Post-Types.post-30x24")} control={control} name={`prices.post-30x24`} />
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


const formatFormData = (data: TelegramFormData, photo: string, userId: string, categories: Category[]): SubmitData => ({
    about: data.about,
    followersCount: data.followersCount ? parseInt(data.followersCount) : 0,
    profilePicture: photo,
    userId: userId,
    cpm: data.cpm ? parseFloat(data.cpm) : undefined,
    cpv: data.cpv ? parseFloat(data.cpv) : undefined,
    menPercentage: data.menPercentage ? parseFloat(data.menPercentage) : undefined,
    womenPercentage: data.womenPercentage ? parseFloat(data.womenPercentage) : undefined,
    ageCategory: data.ageCategory ? data.ageCategory : undefined,
    channelAge: data.channelAge ? parseInt(data.channelAge) : undefined,
    username: data.username ? data.username : '',
    categories: categories,
    prices: Object.fromEntries(Object.values(TelegramAdPostType).map(postType => {
        const price = data.prices[postType] ? parseFloat(data.prices[postType] ?? '') : undefined;
        return [postType, price !== undefined ? { amount: price } : undefined];
    }))
})

export default TelegramBloggerForm
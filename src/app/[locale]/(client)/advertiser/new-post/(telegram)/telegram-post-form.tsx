'use client'

import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Translate from '@/components/Translate'
import { useTranslations } from 'next-intl'
import FileInput from '@/components/ui/custom/form/file-input'
import { allowedTGFiles } from '@/constants/mime-types'
import { useZodSchema } from '@/hooks/use-zod-schema'
import { TelegramPostEmulator } from '@/modules/telegram-post-emulator'
import TelegramFormLinks from './inline-keyboard/telegram-form-links'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useScreenSize } from '@/hooks/use-screen-size'
import { getAttachemntsFormSchema } from '@/database/ad-post/attachments/form-schemas'
import { useState } from 'react'
import { ChevronRightIcon, XIcon } from 'lucide-react'
import { useFileUploads } from '@/hooks/use-file-upload'
import { type UploadedFile } from '@/lib/vercel-blob'
import UploadingFiles from './uploading-files'
import { toast } from 'react-toastify'
import TelegramMessageEditor from './telegram-message-editor'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/trpc/react';
import InfoMessage from '@/components/ui/custom/info-message'
import { Link } from '@/i18n/navigation'


type SubmitData = {
    blobs: UploadedFile[]
} & TelegramPostFormData;

type Props = {
    onSubmit?: (data: SubmitData) => Promise<void> | void;
    isLoading?: boolean;
}

export type TelegramPostFormData = {
    title: string;
    content: string;
    files: File[];
    links: Array<{
        href: string;
        display: string;
    }>
}



const TelegramPostForm = ({ onSubmit, isLoading }: Props) => {
    const { data: user } = api.user.getMyUser.useQuery()
    const [constructorOpen, setConstructorOpen] = useState(false);
    const t = useTranslations()
    const validationT = useTranslations('Validation');

    const { width } = useScreenSize();

    const schema = useZodSchema<TelegramPostFormData>(() => {
        return z.object({
            title: z.string().min(1, validationT('required-field')),
            content: z.string().min(1, validationT('required-field')),
            files: getAttachemntsFormSchema(validationT, { maxFiles: 3, maxFileSizeMB: 3, maxVideoSizeMB: 30 }),
            links: z.array(z.object({
                href: z.string(),
                display: z.string()
            }))
        })
    }, [])

    const form = useForm<TelegramPostFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            content: '',
            title: '',

            files: [],
            links: [],
        }
    })
    const { control, handleSubmit, watch } = form;


    const formData = watch()
    const files = watch('files')
    const fileUploads = useFileUploads('post-attachments', files, allowedTGFiles);
    const canSubmit = (typeof user?.advertiserBalance === 'number' && (user.advertiserBalance >= 200))


    return (
        <div className='w-full flex justify-between  items-start gap-5'>
            <div
                className='max-w-[600px] w-full'
            >
                {!canSubmit ? (
                    <InfoMessage variant={'error'} className='mb-4 max-w-none'>
                        <p className=''>
                            <Translate namespace='Advertiser.New-Post-Page' itemKey='not-enough-balance' />
                        </p>

                        <Link className='hover:underline group text-main/80 mt-3 flex gap-1 items-center ' href={'/advertiser/billing'}>
                            <Translate namespace='Default' itemKey='deposit-balance' />

                            <ChevronRightIcon className='group-hover:ml-1 group-hover:scale-110 duration-150' />
                        </Link>
                    </InfoMessage>
                ) : (null)}

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit((async (data) => {
                            await onSubmit?.({
                                ...data,
                                blobs: fileUploads.blobs
                            });
                        }))}
                    >
                        <FormInput
                            disabled={isLoading}
                            placeholder={t("Advertiser.enterpostname")}
                            label={<Translate namespace="Advertiser" itemKey="postname" />}
                            labelRight={<span className='text-rose-600'> *</span>}
                            transformChangeValue={(val, prevVal) => (
                                val.length > 80
                                    ? prevVal ?? ''
                                    : val
                            )}
                            control={control}
                            name='title'
                        />


                        <FormField
                            control={control}
                            name='files'
                            render={({ field }) => (
                                <FormItem className='mt-3 md:mt-4 lg:mt-6 w-max'>
                                    <FormLabel className="font-bold"><Translate namespace='Advertiser' itemKey='attachment' /></FormLabel>
                                    <FormControl>
                                        <FileInput
                                            disabled={isLoading || fileUploads.isLoading}
                                            multiple
                                            maxFiles={3}
                                            maxWeightExts={{
                                                "*": '5MB'
                                            }}
                                            onError={(error) => {
                                                toast.error(error)
                                            }}
                                            acceptedTypes={allowedTGFiles}
                                            onChange={field.onChange}
                                        />

                                    </FormControl>

                                    {fileUploads.isLoading ? (
                                        <UploadingFiles className='!mt-3' files={files} />
                                    ) : null}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={control}
                            name='content'
                            render={({ field }) => (
                                <FormItem className='mt-3 md:mt-4 lg:mt-6'>
                                    <FormLabel className="font-bold"><Translate namespace="Advertiser" itemKey="content" />
                                        <span className='text-rose-600'> *</span>
                                    </FormLabel>
                                    <FormControl>
                                        <TelegramMessageEditor
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {formData.files.length <= 1 && (
                            <div >
                                <div className='mt-5'>
                                    <h4 className={`font-bold text-sm ${formData.links.length ? "mb-2" : ''}`}>
                                        <Translate namespace="Constructor" itemKey="tg-buttons" />
                                    </h4>

                                    <TelegramFormLinks form={form} />
                                </div>
                            </div>
                        )}

                        <div className='block md:hidden'>
                            {/* Mobile view */}
                            <Drawer
                                dismissible={false}
                                open={constructorOpen}
                                onOpenChange={(isOpen) => setConstructorOpen(isOpen)}
                            >
                                <DrawerTrigger asChild>
                                    <Button className='w-full mt-5' variant="outline">
                                        <Translate namespace='Constructor' itemKey='open' />
                                    </Button>
                                </DrawerTrigger>

                                <DrawerContent className='pb-5'>
                                    <DrawerHeader>
                                        <div className='flex justify-between items-center gap-3'>
                                            <DrawerTitle className='text-left'>
                                                <Translate namespace='Constructor' itemKey='post-constructor' />
                                            </DrawerTitle>

                                            <Button onClick={() => setConstructorOpen(false)} size={'icon'} variant={'ghost'}>
                                                <XIcon />
                                            </Button>
                                        </div>
                                    </DrawerHeader>


                                    <div className='flex justify-center mt-5'>
                                        <TelegramPostEmulator
                                            content={formData.content}
                                            media={fileUploads.blobs.map(blob => blob.url)}
                                            inlineKeyboard={formData.links ?? []}
                                            className=''
                                            disabled={(!formData.content)}
                                        />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>

                        <div className='mt-5 md:mt-6 lg:mt-8'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type='submit'
                                            disabled={isLoading || fileUploads.isLoading || !canSubmit}
                                            className='gap-2'>
                                            {isLoading && <SpinnerLoading />}
                                            <Translate namespace="Advertiser" itemKey="sendmoderation" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p><Translate namespace="Advertiser" itemKey="moderation-descr" /></p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>
                </Form>
            </div>


            {/* Desktop view */}
            {width >= 768 && (
                <div className='flex-1 hidden md:flex justify-center'>
                    <TelegramPostEmulator
                        content={formData.content}
                        media={fileUploads.blobs.map(blob => blob.url)}
                        inlineKeyboard={formData.links ?? []}
                        className=''
                        disabled={(!formData.content)}
                    />
                </div>
            )}
        </div>

    )
}


export default TelegramPostForm
'use client'

import Translate from '@/components/Translate'
import ServerErrorMessage from '@/components/server-error-message'
import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input'
import Select from '@/components/select'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { env } from '@/env.mjs'
import { type Locale, locales } from '@/i18n/config'
import { useRouter } from '@/i18n/navigation'
import { createMessage } from '@/modules/translate-protocol'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const notificationSchema = z.object({
    content: z.string()
})
type NotificationSchemaType = z.infer<typeof notificationSchema>;

const schema = z.object({
    translates: z.object({
        ua: notificationSchema,
        ru: notificationSchema,
        en: notificationSchema
    }) satisfies z.ZodType<Record<Locale, NotificationSchemaType>>,
    link: z.string()
        .refine(link => {
            const url = link.split(`${env.NEXT_PUBLIC_SITE_URL}`)[1]
            const firstUrlSegment = url?.split('/')[1];

            return !locales.includes(firstUrlSegment as Locale)
        }, 'Посилання не повинно містити локалізацію (/en/, /ru/ ...)')
        .optional()
        .default(env.NEXT_PUBLIC_SITE_URL)

})
type CreateNotificationFormData = z.infer<typeof schema>;

const CreateNotificationModal = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedLocale, setSelectedLocale] = useState<Locale>('ua');
    const systemNotify = api.notification.createSystemNotification.useMutation({
        onSuccess: () => {
            setOpen(false)
            reset();
            router.refresh()
        },
    })

    const form = useForm<CreateNotificationFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            translates: Object.fromEntries(
                locales.map(locale => ([
                    locale,
                    { content: '' }
                ]))
            )
        }
    })
    const { control, handleSubmit, setValue, watch, reset } = form;

    const translates = watch('translates')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Створити сповіщення
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Сповіщення
                    </DialogTitle>
                </DialogHeader>

                <div>
                    {systemNotify.error ? (
                        <ServerErrorMessage className='my-3' errorCode={systemNotify.error.message} closable />
                    ) : null}

                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit((data) => {
                                const link = data.link?.split(`${env.NEXT_PUBLIC_SITE_URL}`)[1]

                                systemNotify.mutate({
                                    recipients: {
                                        data: 'ALL'
                                    },
                                    additionalHref: link ?? '/',
                                    text: createMessage({
                                        kind: 'map',
                                        data: data.translates
                                    }),
                                })
                            })}
                        >

                            <FormInput
                                disabled={systemNotify.isLoading}
                                control={control}
                                name='link'
                                mask={[...`${env.NEXT_PUBLIC_SITE_URL}/`.split(''), ...Array(100).fill(/./)]}
                                label="Посилання"
                                placeholder='Вставте посилання'
                                onPaste={(event) => {
                                    event.preventDefault();

                                    const clipboardData = event.clipboardData;
                                    if (clipboardData) {
                                        const pastedText = clipboardData.getData('text');
                                        if (!pastedText.startsWith(`${env.NEXT_PUBLIC_SITE_URL}/`)) return;
                                        const link = pastedText.split(`${env.NEXT_PUBLIC_SITE_URL}`)[1];

                                        setValue('link', `${env.NEXT_PUBLIC_SITE_URL}${link}`)
                                    }
                                }}

                            />

                            <div className='flex items-center gap-2 justify-between mt-6 flex-wrap'>
                                <h4 className='font-bold text-sm'>Оберіть переклад</h4>

                                <Select
                                    classNames={{
                                        content: 'w-[150px]',
                                        trigger: 'w-[150px]'
                                    }}
                                    value={selectedLocale}
                                    items={locales.map(locale => ({
                                        value: locale,
                                        displayValue: <Translate namespace='Locales' itemKey={locale} />
                                    }))}
                                    onChange={(locale) => {
                                        if (!locale) return;

                                        setSelectedLocale(locale);
                                    }}
                                />
                            </div>

                            <Separator className='mb-5 mt-2' />

                            <FormItem>
                                <FormLabel className='font-bold'>Зміст</FormLabel>

                                <FormControl>
                                    <Textarea
                                        disabled={systemNotify.isLoading}
                                        placeholder='Зміст повідомлення'
                                        value={translates[selectedLocale].content}
                                        onChange={(e) => {
                                            setValue(`translates.${selectedLocale}.content`, e.target.value)
                                        }}
                                    />
                                </FormControl>
                            </FormItem>


                            <Button
                                disabled={systemNotify.isLoading}
                                className='mt-8 w-full'
                            >
                                {systemNotify.isLoading && <SpinnerLoading className='mr-2' />}
                                Надіслати
                            </Button>
                        </form>
                    </Form>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CreateNotificationModal
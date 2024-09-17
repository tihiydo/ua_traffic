import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/custom/form/form-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Form } from '@/components/ui/form';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useZodSchema } from '@/hooks/use-zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod';



type LinkFormData = {
    display: string;
    href: string;
}

type Props = {
    link: LinkFormData;
    onSubmit?: (data: LinkFormData) => void;
    onDelete?: () => void;
}
// It is nested form so it is crucial not to use submit event
const EditLinkModal = ({ link, onSubmit, onDelete }: Props) => {
    const validationT = useTranslations('Validation');
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const schema = useZodSchema<LinkFormData>(() => {
        return z.object({
            href: z.string().url(validationT('invalid-url-link')),
            display: z.string().min(1, validationT('required-field'))
        })
    }, [])
    const form = useForm<LinkFormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            ...link
        }
    });
    const { control, getValues, formState: { isValid } } = form;
    const { width } = useScreenSize();

    if (width > 768) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        type='button'
                        variant={'secondary'} className='flex-1 w-full border-gray-secondary border-1'
                    >
                        {link.display}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className='mb-5'>
                        <DialogTitle>
                            <Translate namespace='Constructor' itemKey='edit-tg-button-title' />
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <div>
                            <FormInput
                                label={t('Constructor.label/tg-button-text')}
                                placeholder={t('Constructor.placeholder/tg-button-text')}
                                control={control}
                                name='display'
                            />

                            <FormInput
                                className='mt-3'
                                label={t('Constructor.label/tg-button-link')}
                                placeholder={t('Constructor.placeholder/tg-button-link')}
                                control={control}
                                name='href'
                            />

                            <div className='flex gap-2 mt-5'>
                                <Button
                                    disabled={!isValid}
                                    type='button'
                                    onClick={() => {
                                        if (!isValid) return;
                                        setOpen(false)
                                        onSubmit?.(getValues())
                                    }}
                                >
                                    <Translate namespace='Default' itemKey='submit' />
                                </Button>

                                <Button
                                    type='button'
                                    className='gap-2'
                                    variant={'outline'}
                                    onClick={() => {
                                        onDelete?.();
                                    }}
                                >
                                    <TrashIcon />
                                    <Translate namespace='Default' itemKey='delete' />
                                </Button>
                            </div>

                        </div>
                    </Form>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    type='button'
                    variant={'secondary'} className='flex-1 w-full border-gray-secondary border-1'
                >
                    {link.display}
                </Button>
            </DrawerTrigger>
            <DrawerContent className='p-4'>
                <DrawerHeader className='mb-5'>
                    <DrawerTitle>
                        <Translate namespace='Constructor' itemKey='edit-tg-button-title' />
                    </DrawerTitle>
                </DrawerHeader>

                <Form {...form}>
                    <div>
                        <FormInput
                            label={t('Constructor.label/tg-button-text')}
                            placeholder={t('Constructor.placeholder/tg-button-text')}
                            control={control}
                            name='display'
                        />

                        <FormInput
                            className='mt-3'
                            label={t('Constructor.label/tg-button-link')}
                            placeholder={t('Constructor.placeholder/tg-button-link')}
                            control={control}
                            name='href'
                        />

                        <div className='flex gap-2 mt-5'>
                            <Button
                                disabled={!isValid}
                                type='button'
                                onClick={() => {
                                    if (!isValid) return;
                                    setOpen(false)
                                    onSubmit?.(getValues())
                                }}
                            >
                                <Translate namespace='Default' itemKey='submit' />
                            </Button>

                            <Button
                                type='button'
                                className='gap-2'
                                variant={'outline'}
                                onClick={() => {
                                    onDelete?.();
                                }}
                            >
                                <TrashIcon />
                                <Translate namespace='Default' itemKey='delete' />
                            </Button>
                        </div>

                    </div>
                </Form>
            </DrawerContent>
        </Drawer>
    )
}

export default EditLinkModal
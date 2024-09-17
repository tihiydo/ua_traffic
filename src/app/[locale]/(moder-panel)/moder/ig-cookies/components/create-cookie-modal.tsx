'use client';

import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/custom/form/form-input';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1, `Обов'язкове поле`),
    value: z.string().min(1, `Обов'язкове поле`),
    username: z.string().min(1, `Обов'язкове поле`)
})

type CreateCookieFormData = z.infer<typeof schema>;

const CreateCookieModal = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const form = useForm<CreateCookieFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            value: '',
        }
    })

    const { control, handleSubmit } = form;
    const createCookie = api.admin.igCookie.createCookie.useMutation({
        onSuccess: () => {
            toast.success("Нові Cookie створено")
            router.refresh();
            setOpen(false)
        },
        onError: ({ message }) => {
            toast.error(message)
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Створити Cookie
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Створення Instagram Cookie
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(data => {
                        createCookie.mutate(data);
                    })}>
                        <FormInput
                            disabled={createCookie.isLoading}
                            control={control}
                            name='name'
                            label="Назва"
                            placeholder='Впишіть назву Cookie'
                        />

                        <FormInput
                            disabled={createCookie.isLoading}
                            className='mt-6'
                            control={control}
                            name='username'
                            label="Ім'я користувача Instagram"
                            placeholder="Впишіть ім'я користувача"
                        />

                        <FormInput
                            disabled={createCookie.isLoading}
                            className='mt-6'
                            label="Cookie"
                            placeholder='Вставте скопійовані Cookie'
                            control={control}
                            name='value'
                        />

                        <Button type='submit' className='mt-8' disabled={createCookie.isLoading}>
                            {createCookie.isLoading && <SpinnerLoading className='mr-2' />}
                            Підтвердити
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCookieModal
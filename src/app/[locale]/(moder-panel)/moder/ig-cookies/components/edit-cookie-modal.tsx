'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { PenIcon } from 'lucide-react';
import { type IGCookie } from '@prisma/client';
import { Form } from '@/components/ui/form';
import FormInput from '@/components/ui/custom/form/form-input';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const schema = z.object({
    name: z.string().min(1, `Обов'язкове поле`),
    value: z.string().min(1, `Обов'язкове поле`)
})

type EditCookieFormData = z.infer<typeof schema>;

type Props = {
    cookie: IGCookie;
}

const EditCookieModal = ({ cookie }: Props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const editCookie = api.admin.igCookie.updateCookie.useMutation({
        onSuccess: () => {
            toast.success("Cookie оновлено")
            router.refresh();
            setOpen(false);
        },
        onError: ({ message }) => {
            toast.error(message)
        }
    });

    const form = useForm<EditCookieFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: cookie.name,
            value: cookie.value
        }
    })

    const { control, handleSubmit } = form;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span className="flex items-center gap-x-2">
                    <PenIcon size={18} />
                    Редагувати
                </span>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Оновлення Instagram Cookie
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(data => {
                        editCookie.mutate({ id: cookie.id, ...data, });
                    })}>
                        <FormInput
                            disabled={editCookie.isLoading}
                            control={control}
                            name='name'
                            label="Назва"
                            placeholder='Впишіть назву Cookie'
                        />

                        <FormInput
                            disabled={editCookie.isLoading}
                            className='mt-6'
                            label="Cookie"
                            placeholder='Вставте скопійовані Cookie'
                            control={control}
                            name='value'
                        />

                        <Button type='submit' className='mt-8' disabled={editCookie.isLoading}>
                            {editCookie.isLoading && <SpinnerLoading className='mr-2' />}
                            Підтвердити
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditCookieModal
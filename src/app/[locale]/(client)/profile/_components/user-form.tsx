'use client'

import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/custom/form/form-input';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import deepEqual from 'fast-deep-equal'
import { Form } from '@/components/ui/form';
import { Link, useRouter } from '@/i18n/navigation';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import ServerErrorMessage from '@/components/server-error-message';
import { useZodSchema } from '@/hooks/use-zod-schema';
import { LogOutIcon } from 'lucide-react';

type Props = {
    defaultValues?: Partial<UserFormData>;
}

type UserFormData = {
    name?: string;
    tel?: string;
    telegram?: string;
    email?: string;
}

const UserForm = ({ defaultValues }: Props) => {
    const t = useTranslations()
    const validationT = useTranslations('Validation')
    const router = useRouter();

    const schema = useZodSchema<UserFormData>(() => {
        return z.object({
            name: z.string().trim().optional(),
            tel: z.string().trim()
                .refine((arg) => {
                    if (!arg) return true;

                    return arg.length === 16;
                }, validationT('invalid-tel'))
                .optional(),
            telegram: z.string().trim().optional(),
            email: z.string().optional()
        })
    }, [])


    const { mutate: updateUser, isLoading, error } = api.user.updateUser.useMutation({
        onSuccess: () => {
            toast.success(t("Messages.profile-update"))
            router.refresh()
        },
    });

    const { mutateAsync: removeUser, isLoading: isLoadingRemove } = api.user.removeUser.useMutation({
        onSuccess: async () => 
        {
            await signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })
        },
    });
 
    const form = useForm<UserFormData>({
        mode: 'onBlur',
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultValues,
        }
    })
    const { control, handleSubmit, watch } = form;


    return (
        <Form {...form}>
            <form onSubmit={handleSubmit((data) => {
                updateUser(data)
            })}>
                {error?.message ? (
                    <ServerErrorMessage errorCode={error.message} closable className='my-2' />
                ) : null}

                <FormInput
                    disabled={isLoading}
                    className='mb-2'
                    control={control}
                    name='name'
                    label={<Translate namespace="Profile" itemKey="nameprofile" />}
                    placeholder={'Прізвище Ім\'я'}
                />

                <FormInput
                    disabled={isLoading}
                    className='mb-2'
                    control={control}
                    name='tel'
                    label={<Translate namespace="Profile" itemKey="phonenumber" />}
                    placeholder={'+380 999 99 99'}
                    mask={'+380\\ 99 999 9999'}
                />

                <div className='mb-2'>
                    <FormInput
                        control={control}
                        disabled
                        name={'email'}
                        label={'Email'}
                        placeholder={'example@foxycode.tech'}
                    />

                    <div className='text-sm mt-1.5'>
                        <Translate namespace="Profile" itemKey="receiveemail" />
                        {" "}
                        <Button asChild variant={'link'}>
                            <Link href={'/profile/settings'} className='text-yellow'>
                                <Translate namespace="Profile" itemKey="setting" />
                            </Link>
                        </Button>

                    </div>
                </div>

                <div className='flex flex-col gap-y-4 mt-[2rem]  w-full'>
                    <div className='flex flex-row gap-x-3 w-full justify-between'>
                        <Button
                            className='w-[15rem]'
                            type='submit'
                            disabled={isLoading || deepEqual(watch(), defaultValues)}
                        >
                            {isLoading && <SpinnerLoading className='mr-2' />}
                            <Translate namespace="Profile" itemKey="save" />
                        </Button>
                        <Button type="button" variant={"destructive"} className="w-[172px]" onClick={async () => await removeUser()} disabled={isLoadingRemove}>
                            {!isLoadingRemove
                            ?
                            <Translate namespace="Profile" itemKey="remove" />
                            :
                            <SpinnerLoading/>
                            }
                        </Button>
                    </div>
                    <Button
                        type='button'
                        variant={"link"}
                        className='!h-[40px] text-center !w-[15rem] flex gap-x-1' onClick={
                            async () => {
                                await signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL })
                            }
                        }>
                        <LogOutIcon size={"10px"} />
                        <Translate namespace="Profile" itemKey="exit" />
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default UserForm
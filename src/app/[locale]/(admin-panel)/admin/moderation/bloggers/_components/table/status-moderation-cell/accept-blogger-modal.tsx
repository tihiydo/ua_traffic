'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useUpdateBlogger } from "./use-update-blogger";
import Translate from '@/components/Translate';
import MultipleSelect from '@/components/ui/custom/multiple-select';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createUnionSchema } from '@/lib/zod/create-many-union';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BloggerTag } from '@prisma/client';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type Blogger } from "@/database/blogger";
import { categories } from "@/database/blogger/categories";
import TextEditor from "@/components/ui/custom/text-editor";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
    categories: z.array(createUnionSchema(categories)).optional(),
    tags: z.array(z.nativeEnum(BloggerTag)).optional(),
    about: z.string().min(30, 'Мінімум 30 символів'),
    womenPercentage: z.number().optional(),
    menPercentage: z.number().optional(),
    ageCategory: z.string().optional(),
    cpm: z.number().optional(),
    cpv: z.number().optional(),
    channelAge: z.number().optional(),
})
type EditBloggerFormData = z.infer<typeof schema>

type Props = {
    blogger: Blogger,
    isLoading: boolean
}

const AcceptBloggerModal = ({ blogger, isLoading }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const updateBlogger = useUpdateBlogger();
    const acceptBlogger = api.admin.blogger.acceptBlogger.useMutation({
        onSuccess: (updatedBlogger) => {
            setOpen(false);

            updateBlogger(updatedBlogger)
        }
    });

    const form = useForm<EditBloggerFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            tags: blogger.tags ?? undefined,
            categories: blogger.categories,
            about: blogger.about,
            womenPercentage: blogger.womenPercentage ?? undefined,
            menPercentage: blogger.menPercentage ?? undefined,
            ageCategory: blogger.ageCategory ?? undefined,
            cpm: blogger.cpm ?? undefined,
            cpv: blogger.cpv ?? undefined,
            channelAge: blogger.channelAge ?? undefined,
        }
    })
    const { control, handleSubmit, reset } = form;

    console.log(blogger)

    return (
        <Dialog
            open={open}
            onOpenChange={(openState) => {
                if (!openState) {
                    reset()
                }

                setOpen(openState);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    className="mx-1 font-bold"
                    variant={'success'}
                >
                    <Translate namespace='Default' itemKey='accept' />
                </Button >
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto" style={{ scrollbarColor: '#FFDD5F transparent' }}>
                <DialogHeader>
                    <DialogTitle>Прийняття каналу</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit((data) => {
                            acceptBlogger.mutate({
                                bloggerId: blogger.id,
                                categories: data.categories || [], 
                                ...data
                            })
                        })}
                        className="space-y-4"
                    >
                        <FormField
                            control={control}
                            name='categories'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Оберіть категорії</FormLabel>
                                    <FormControl>
                                        <MultipleSelect
                                            disabled={acceptBlogger.isLoading}
                                            value={field.value}
                                            onChange={field.onChange}
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
                            control={control}
                            name='tags'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Оберіть теги</FormLabel>
                                    <FormControl>
                                        <MultipleSelect
                                            disabled={acceptBlogger.isLoading}
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={Object.values(BloggerTag).map((tag) => ({
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name='womenPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Відсоток жінок</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='menPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Відсоток чоловіків</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                                    <SelectValue placeholder={'dd'} />
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name='cpm'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPM</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='cpv'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPV</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name='channelAge'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Вік каналу</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='about'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Про канал</FormLabel>
                                    <FormControl>
                                        <TextEditor
                                            height={300}
                                            disabled={acceptBlogger.isLoading}
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
                            className='w-full'
                            disabled={acceptBlogger.isLoading}
                        >
                            {acceptBlogger.isLoading && <SpinnerLoading className='mr-2' />}
                            Прийняти
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AcceptBloggerModal

'use client';

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Edit } from 'lucide-react';
import Translate from "@/components/Translate";
import RatingInputAdmin from './ratingInputAdmin';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Textarea } from '@/components/ui/textarea';


const schema = z.object({
    reviewId: z.string(),
    professionalism: z.number().min(0).max(5).optional().nullable(),
    quality: z.number().min(0).max(5).optional().nullable(),
    price: z.number().min(0).max(5).optional().nullable(),
    communication: z.number().min(0).max(5).optional().nullable(),
    text: z.string().min(10).max(500),
});

type EditReviewFormData = z.infer<typeof schema>;

interface EditReviewModalProps {
    reviewId: string;
    initialData: {
        professionalism: number | null;
        quality: number | null;
        price: number | null;
        communication: number | null;
        text: string;
    };
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ reviewId, initialData }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const form = useForm<EditReviewFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            reviewId,
            ...initialData,
        }
    });

    const { control, handleSubmit } = form;
    const editReview = api.admin.reviews.editReview.useMutation({
        onSuccess: () => {
            toast.success("Відгук успішно відредаговано");
            router.refresh();
            setOpen(false);
        },
        onError: ({ message }) => {
            toast.error(message);
        }
    });

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === ' ') {
            e.stopPropagation();
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-x-2 cursor-pointer">
                    <Edit size={18} />
                    Редагувати
                </div>
            </DialogTrigger>

            <DialogContent onKeyDown={handleKeyDown}>
                <DialogHeader>
                    <DialogTitle>
                        Редагувати
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(data => {
                        editReview.mutate(data);
                    })}>
                        <RatingInputAdmin
                            control={control}
                            name="professionalism"
                            label={<Translate namespace="Blogger" itemKey="professionalism" />}
                        />
                        <RatingInputAdmin
                            control={control}
                            name="quality"
                            label={<Translate namespace="Blogger" itemKey="quality" />}
                        />
                        <RatingInputAdmin
                            control={control}
                            name="price"
                            label={<Translate namespace="Blogger" itemKey="price" />}
                        />
                        <RatingInputAdmin
                            control={control}
                            name="communication"
                            label={<Translate namespace="Blogger" itemKey="communication" />}
                        />
                        
                        <div className='gap-3'>
                            <FormField
                                control={control}
                                name='text'
                                render={({ field }) => (
                                    <FormItem className='mt-3 md:mt-4 lg:mt-6'>
                                        <FormControl>
                                            <Textarea
                                                value={field.value}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    field.onChange(newValue);

                                                }}
                                                className='placeholder:text-gray-secondary'
                                                placeholder={"змінити текст посту"}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='mt-7' disabled={editReview.isLoading}>
                                {editReview.isLoading && <SpinnerLoading className='mr-2' />}
                                Зберегти
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditReviewModal;
'use client';

import Translate from "@/components/Translate";
import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormItem, FormField, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import RatingInput from './ratingInput';
import { Textarea } from '@/components/ui/textarea';


interface ReviewModalProps {
    bloggerId: string;
    requestId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ bloggerId, requestId }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const validationT = useTranslations('Validation');

    const schema = z.object({
        bloggerId: z.string(),
        requestId: z.string(),
        professionalism: z.number().min(0).max(5).optional(),
        quality: z.number().min(0).max(5).optional(),
        price: z.number().min(0).max(5).optional(),
        communication: z.number().min(0).max(5).optional(),
        text: z.string()
            .min(10, validationT('min-length', { length: 10 }))
            .max(500, validationT('max-length', { length: 500 }))
    });

    type CreateReviewFormData = z.infer<typeof schema>;

    const form = useForm<CreateReviewFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            bloggerId,
            requestId,
            professionalism: 0,
            quality: 0,
            price: 0,
            communication: 0,
            text: '',
        }
    });

    const { control, handleSubmit, reset } = form;
    const createReview = api.blogger.rateBlogger.useMutation({
        onSuccess: () => {
            toast.success(t('reviewSuccess'));
            router.refresh();
            setOpen(false);
        },
        onError: ({ message }) => {
            toast.error(message);
        }
    });

    const t = useTranslations('Blogger');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === ' ') {
            e.stopPropagation();
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-x-2 cursor-pointer">
                    <Star size={18} />
                    <Translate namespace="Blogger" itemKey="rate" />
                </div>
            </DialogTrigger>

            <DialogContent onKeyDown={handleKeyDown}>
                <DialogHeader>
                    <DialogTitle>
                        <Translate namespace="Blogger" itemKey="leaveReview" />
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(data => {
                        createReview.mutate(data);
                    })}>
                        <div className='grid grid-cols-2 '>
                            <RatingInput
                                control={control}
                                name="professionalism"
                                label={<Translate namespace="Blogger" itemKey="professionalism" />}
                            />
                            <RatingInput
                                control={control}
                                name="quality"
                                label={<Translate namespace="Blogger" itemKey="quality" />}
                            />
                            <RatingInput
                                control={control}
                                name="price"
                                label={<Translate namespace="Blogger" itemKey="price" />}
                            />
                            <RatingInput
                                control={control}
                                name="communication"
                                label={<Translate namespace="Blogger" itemKey="communication" />}
                            />
                        </div>
                        <FormField
                            control={control}
                            name='text'
                            render={({ field, fieldState }) => (
                                <FormItem className='mt-3 md:mt-4 lg:mt-6'>
                                    <FormControl>
                                        <Textarea
                                            value={field.value}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                field.onChange(newValue);
                                            }}
                                            className='placeholder:text-gray-secondary'
                                            placeholder={t('textReview') + '...'}
                                        />
                                    </FormControl>
                                    {fieldState.error && (
                                        <FormMessage>
                                            {fieldState.error.message ? validationT(fieldState.error.message) : validationT('defaultError')}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />

                        <Button type='submit' className='mt-7' disabled={createReview.isLoading}>
                            {createReview.isLoading && <SpinnerLoading className='mr-2' />}
                            <Translate namespace="Default" itemKey="submit" />
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ReviewModal;

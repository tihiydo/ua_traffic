import React from 'react';
import { api } from '@/trpc/server';
import { StarIcon } from 'lucide-react';
import GoBackLink from '@/components/go-back-link';
import { Separator } from '@/components/ui/separator';
import BloggerAvatar from '@/components/ui/custom/blogger-avatar';
import { Link } from '@/i18n/navigation';

type Props = {
    params: {
        reviewId: string
    }
}

const ReviewRatingPage = async ({ params }: Props) => {
    if (!params.reviewId) {
        throw new Error("Review ID is required");
    }

    const review = await api.admin.reviews.getReview.query({ reviewId: params.reviewId });

    if (!review) {
        return <div>Відгук не знайдено</div>;
    }

    const RatingItem = ({ label, value }: { label: string, value: number | null }) => (
        <div className="flex items-center justify-between">
            <span className="font-bold">{label}</span>
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={`h-5 w-5 ${value !== null && star <= value ? 'text-yellow' : 'text-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className='mb-5'>
            <GoBackLink />

            <div className='mt-5 mx-auto max-w-2xl border border-gray-secondary rounded-md p-6'>
                <div className='flex gap-5 mb-4'>
                    <BloggerAvatar className='size-20' src={review.blogger.profilePicture} />
                    <div>
                        <h2 className='font-title text-xl'>{review.blogger.username}</h2>
                        <Link href={review.blogger.profileLink || '#'} className='hover:underline'>
                            Профіль блогера
                        </Link>
                    </div>
                </div>

                <Separator className='my-4' />

                <div className='space-y-3'>
                    <RatingItem label="Професіоналізм" value={review.professionalism} />
                    <RatingItem label="Якість" value={review.quality} />
                    <RatingItem label="Ціна" value={review.price} />
                    <RatingItem label="Комунікація" value={review.communication} />
                </div>

                <Separator className='my-4' />

                <div>
                    <h3 className='font-bold mb-2'>Коментар:</h3>
                    <p className='text-gray-700'>{review.text}</p>
                </div>

                <Separator className='my-4' />

                <div className='text-sm text-gray-500'>
                    <p>Статус: {review.status}</p>
                    <p>Дата створення: {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}

export default ReviewRatingPage;
"use client";

import Translate from '@/components/Translate';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { CalendarIcon } from 'lucide-react';
import ClientRatingStars from '@/app/[locale]/(blog)/blog/_components/ClientRatingStars';

type ReviewType = {
    id: string;
    professionalism: number | null;
    quality: number | null;
    price: number | null;
    communication: number | null;
    text: string;
    createdAt: Date;
    advertiser: {
        email: string | null;
    };
};

type Props = {
    className?: string;
    reviews: ReviewType[];
}

const BloggerReviews = ({ className, reviews }: Props) => {
    const t = useTranslations('Blogger');

    return (
        <section className={cn(className)}>
            <h4 className='text-xl font-title first-letter:bg-yellow mb-2'>
                <Translate namespace='Blogger' itemKey='reviews' />
            </h4>

            <div className='grid gap-5'>
                {reviews.map((review, index) => (
                    <div key={index} className='border border-slate-300 rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex flex-col items-start'>
                                {review.advertiser.email && (
                                    <p className='text-md text-black mb-2'>{review.advertiser.email}</p>
                                )}
                                <div className='flex items-center text-slate-400'>
                                    <CalendarIcon className='w-7 h-7 mr-2' />
                                    <span>{review.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mb-6'>
                            <div>
                                <div className='flex justify-between items-center mb-2'>
                                    <p className='font-bold mr-2'>{t('professionalism')}:</p>
                                    <ClientRatingStars
                                        count={5}
                                        value={review?.professionalism || 0} 
                                        editing={false}
                                        size={25}
                                        activeColor="#ffc107"
                                        isHalf={true}
                                        staticMode={true}
                                        inactiveColor='#d2d6dc'
                                    />
                                </div>
                                <div className='flex justify-between items-center mb-2'>
                                    <p className='font-bold mr-2'>{t('price')}:</p>
                                    <ClientRatingStars
                                        count={5}
                                        value={review?.price || 0}
                                        editing={false}
                                        size={25}
                                        activeColor="#ffc107"
                                        isHalf={true}
                                        staticMode={true}
                                        inactiveColor='#d2d6dc'
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between items-center mb-2'>
                                    <p className='font-bold mr-2'>{t('quality')}:</p>
                                    <ClientRatingStars
                                        count={5}
                                        value={review?.quality || 0}
                                        editing={false}
                                        size={25}
                                        activeColor="#ffc107"
                                        isHalf={true}
                                        staticMode={true}
                                        inactiveColor='#d2d6dc'
                                    />
                                </div>
                                <div className='flex justify-between items-center mb-2'>
                                    <p className='font-bold mr-2'>{t('communication')}:</p>
                                    <ClientRatingStars
                                        count={5}
                                        value={review?.communication || 0}
                                        editing={false}
                                        size={25}
                                        activeColor="#ffc107"
                                        isHalf={true}
                                        staticMode={true}
                                        inactiveColor='#d2d6dc'
                                    />
                                </div>
                            </div>
                        </div>
                        <p className='select-text text-gray-700'>{review.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BloggerReviews;

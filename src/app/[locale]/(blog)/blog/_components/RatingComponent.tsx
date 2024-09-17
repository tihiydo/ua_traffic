"use client";

import { useState } from 'react';
import ClientRatingStars from './ClientRatingStars';
import { api } from "@/trpc/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslations } from 'next-intl';

interface RatingComponentProps {
  articleId: string;
  initialRating: number;
  inactiveColor?: string;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
    articleId, initialRating, inactiveColor = "#ddd" 
}) => {
    const [rating, setRating] = useState(initialRating);
    const [userRated, setUserRated] = useState(false);
    const t = useTranslations('Blog');

    const rateArticleMutation = api.blog.rateArticle.useMutation();

    const handleRatingChange = async (newRating: number) => {
        try {
            await rateArticleMutation.mutateAsync({ articleId, rating: newRating });
            setRating(newRating);
            setUserRated(true);
            toast.success(t('ratingSuccess') + newRating);
        } catch (error) {
            console.error("Error rating article:", error);
            toast.error('Сталася помилка під час встановлення рейтингу');
        }
    };

    return (
        <ClientRatingStars
            value={rating}
            editing={!userRated}
            count={5}
            size={24}
            activeColor="#ffc107"
            inactiveColor={inactiveColor}
            isHalf={true}
            onChange={handleRatingChange}
        />
    );
};

export default RatingComponent;

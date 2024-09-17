import { type BloggerReview } from '@prisma/client';

export function calculateRating(review: BloggerReview, currentRating: number): number {
    const reviewImpact = (review.professionalism ?? 0) + (review.quality ?? 0) +
        (review.price ?? 0) + (review.communication ?? 0);

    const impact = reviewImpact === 0 ? -25 : reviewImpact;

    return Math.max(0, Math.round(currentRating + impact));
}
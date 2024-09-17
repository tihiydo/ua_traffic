import { createTRPCRouter } from '@/server/api/trpc';
import { getReviewsProcedure } from './procedures/getReviews';
import { deleteReviewProcedure } from './procedures/deleteReview';
import { moderateReviewProcedure } from './procedures/moderateReview';
import { getReview } from './procedures/getReview';
import { editReviewProcedure } from './procedures/editReviews';



export const reviewsRouter = createTRPCRouter({
    getReviews: getReviewsProcedure,
    deleteReview: deleteReviewProcedure,
    moderateReview: moderateReviewProcedure,
    getReview: getReview,
    editReview: editReviewProcedure
})
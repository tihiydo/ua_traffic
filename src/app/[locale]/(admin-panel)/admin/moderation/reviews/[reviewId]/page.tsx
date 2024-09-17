import ReviewRatingPage from '../_components/reviewPage';

export default function Page({ params }: { params: { reviewId: string } }) {
    return <ReviewRatingPage params={params} />;
}
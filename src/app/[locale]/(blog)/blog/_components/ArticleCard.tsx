import Link from 'next/link';
import ClientRatingStars from './ClientRatingStars';
import { useLocale } from 'next-intl';

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    createdAt: string;
    ratings: { rating: number }[];
  };
  isLatest?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isLatest = false }) => {
    const locale = useLocale();
    const formattedDate = new Date(article.createdAt).toLocaleDateString();
    const ratings = article.ratings || [];
    const averageRating = ratings.length > 0
        ? ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length
        : 0;

    return (
        <div className={`p-4 rounded-lg h-full flex flex-col bg-white transition-transform transform hover:scale-105 ${isLatest ? 'md:col-span-2' : ''}`}>
            <Link href={`/${locale}/blog/${article.slug}`} passHref legacyBehavior>
                <a className="block flex-grow group">
                    <div className={`overflow-hidden rounded-lg mb-4 ${isLatest ? 'h-72' : 'h-48'}`}>
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-lg transition-transform transform group-hover:scale-110"
                        />
                    </div>
                    <h2 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h2>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{formattedDate}</span>
                        <div className="flex items-center">
                            <ClientRatingStars
                                count={5}
                                value={averageRating}
                                editing={false}
                                size={18}
                                activeColor="#ffc107"
                                isHalf={true}
                                staticMode={true}
                                inactiveColor='#d2d6dc'
                            />
                            <span className="ml-2">({ratings.length})</span>
                        </div>
                    </div>
                    <div 
                        className="text-gray-700 mb-2 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: article.description }}
                    />
                </a>
            </Link>
            {!isLatest && <div className="border-t-2 border-gray-300 mt-4"></div>}
        </div>
    );
};

export default ArticleCard;
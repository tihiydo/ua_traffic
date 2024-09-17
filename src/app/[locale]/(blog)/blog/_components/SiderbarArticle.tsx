import Link from 'next/link';
import ClientRatingStars from './ClientRatingStars';
import type { BlogArticle, ArticleRating } from '@prisma/client';


type Props = {
  article: BlogArticle & { ratings: ArticleRating[] };
};

const SidebarArticle = ({ article }: Props) => {
    const formattedDate = new Date(article.createdAt).toLocaleDateString();
    const ratings = article.ratings || [];
    const averageRating: number = ratings.length > 0 ? 
        ratings.reduce((total: number, rating: { rating: number }) => total + rating.rating, 0) / ratings.length 
        : 0;

    return (
        <div className="mb-6">
            <Link href={`/blog/${article.slug}`} passHref legacyBehavior>
                <a className="block group">
                    <h3 className="text-lg font-bold mb-1 line-clamp-2">{article.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                        <span>{formattedDate}</span>
                        <div className="flex items-center">
                            <ClientRatingStars 
                                count={5} 
                                value={averageRating} 
                                editing={false} 
                                size={16} 
                                activeColor="#ffc107" 
                                isHalf={true}
                                staticMode={true}
                                inactiveColor="#d2d6dc"
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
            <div className="border-t-2 border-gray-300 mt-4"></div>
        </div>
    );
};

export default SidebarArticle;

import noAvatar from '@/assets/images/no-avatar.png';
import ImageWithFallback from './image-with-fallback';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

type Props = {
    src: Maybe<string>;
    className?: string;
}

const BloggerAvatar = ({ src, className, ...props }: Props) => {
    return (
        <div className={twMerge('relative bg-gray rounded-full overflow-hidden', className)}>
            <ImageWithFallback
                alt='Blogger'
                src={src ?? ''}
                unoptimized
                fallback={<Image className='scale-[70%]' fill src={noAvatar} alt='Blogger' />}
                fill
                {...props}
            />
        </div>

    )
}

export default BloggerAvatar
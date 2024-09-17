'use client'

import type { AdvertismentPost } from '@prisma/client'
import { type SelectProps } from '@radix-ui/react-select';
import { useOrderablePosts } from './use-orderable-posts';
import Select, { type FormSelectItem } from '../select';
import { useTranslations } from 'next-intl';
import { type AdPostType } from '@/database/ad-post/post/post-types';
import type { Blogger } from "@/database/blogger";


type Props = {
    value?: string;
    onChange?: (value?: AdvertismentPost) => void;
    blogger: Blogger;
    postType?: AdPostType;
} & Omit<SelectProps, 'value' | 'onChange'>

const AdvertismentSelect = ({ blogger, value, onChange, postType }: Props) => {
    const t = useTranslations();
    const { data: advertismentPosts = [], isLoading } = useOrderablePosts(blogger, postType);

    const items: FormSelectItem[] = advertismentPosts.map(post => {

        return {
            value: post.id,
            displayValue: <div className=''>
                {post.title}
            </div>
        }

    })
    return (
        <Select
            value={value}
            items={items}
            onChange={(selectedPostId) => {
                const post = advertismentPosts.find(post => post.id === selectedPostId);
                if (!post) return;

                onChange?.(post)
            }}
            placeholder={t('Catalogue.selectpost')}
            isLoading={isLoading}
            classNames={{
                content: 'w-[90vw] max-w-[460px] md:w-56 md:max-w-none ',
            }}

        />
    )
}

export default AdvertismentSelect
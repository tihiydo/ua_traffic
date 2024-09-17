import { Card } from '@/components/ui/card'
import BloggerAvatar from '@/components/ui/custom/blogger-avatar';
import { type Blogger } from '@/database/blogger';
import { useTranslations } from 'next-intl';
import React from 'react'
import { twMerge } from 'tailwind-merge';

type Props = {
    blogger: Blogger;
    className?: string;
}


const AccountCard = ({ blogger, className }: Props) => {
    const t = useTranslations("Blogger");

    return (
        <Card className={twMerge(" w-full py-3 px-4", className)}>
            <div className="flex h-[100%]">
                <BloggerAvatar className='w-16 h-16' src={blogger.profilePicture} />

                <div className="grid grid-rows-2 self-center ml-4">
                    <div className='font-bold'>
                        @{blogger.username}
                    </div>
                    <div className='text-sm'>
                        {blogger.followersCount} {t("followersby")}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AccountCard
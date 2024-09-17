import { Card } from '@/components/ui/card'
import BloggerAvatar from '@/components/ui/custom/blogger-avatar';
import { useTranslations } from 'next-intl';
import React from 'react'

type Props = {
    image: string;
    username: string | null;
    followersCount: number | null;
}


const AccountCard = ({ image, followersCount, username }: Props) => {
    const t = useTranslations("Blogger");
    return (
        <Card className=" w-full py-3 px-4">
            <div className="flex h-[100%]">
                <BloggerAvatar className='w-16 h-16' src={image} />

                <div className="grid grid-rows-2 self-center ml-4">
                    <div className='font-bold'>
                        @{username}
                    </div>
                    <div className='text-sm'>
                        {followersCount} {t("followersby")}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AccountCard
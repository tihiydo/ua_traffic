import TelegramPostView from "./telegram-post-view";
import InstagramPostView from "./instagram-post-view";


import React from 'react'
import { type DiscriminatedAdPost } from "@/database/ad-post/post";

type Props = {
    advPost: DiscriminatedAdPost;
    className?: string;
}

const AdvertismentPostView = ({ advPost, className }: Props) => {
    return (
        <div className={className}>
            {advPost.social === 'Instagram'
                ? <InstagramPostView advertismentPost={advPost} />
                : <TelegramPostView advertismentPost={advPost} />
            }
        </div>
    )
}

export default AdvertismentPostView
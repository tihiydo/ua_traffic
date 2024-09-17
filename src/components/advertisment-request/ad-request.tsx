// import TelegramPostView from "./telegram-post-view";
// import InstagramPostView from "./instagram-post-view";



import React from 'react'
import InstagramAdRequest from './instagam-ad-request';
import {
    type AdRequest as TAdRequest,
    type InstagramAdRequest as TypeInstagramAdRequest,
    type TelegramAdRequest as TypeTelegramAdRequest
} from '@/database/ad-request';
import TelegramAdRequest from './telegram-ad-request';

type Props = {
    adRequest: TAdRequest;
    className?: string;
}

const AdRequest = ({ adRequest, className }: Props) => {
    return (
        <div className={className}>
            {adRequest.AdvertismentPost.social === 'Instagram'
                ? <InstagramAdRequest request={adRequest as TypeInstagramAdRequest} />
                : <TelegramAdRequest request={adRequest as TypeTelegramAdRequest} />
            }
        </div>
    )
}

export default AdRequest
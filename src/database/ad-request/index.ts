import type { Prisma } from "@prisma/client";
import type { AdPost, InstagramAdPost, TelegramAdPost } from "../ad-post/post";
import { IGBlogger, TGChannel } from "../blogger";

type PureAdRequest = Prisma.AdvertismentRequestGetPayload<{ include: { AdvertismentPost: true } }>

// export type BaseAdRequest<T extends PureAdRequest = PureAdRequest> = ReplaceKeys<T, 'AdvertismentPost', {
//     AdvertismentPost: AdPost
// }>

export type InstagramAdRequest = ReplaceKeys<PureAdRequest, 'AdvertismentPost', {
    AdvertismentPost: InstagramAdPost;
}> & {
    Blogger?: IGBlogger
}

export type TelegramAdRequest = ReplaceKeys<PureAdRequest, 'AdvertismentPost', {
    AdvertismentPost: TelegramAdPost;
}> & {
    Blogger?: TGChannel
}

export type AdRequest =
    | InstagramAdRequest
    | TelegramAdRequest

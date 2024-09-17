import type { SocialType, AdvertismentPost as PureAdPost } from "@prisma/client";
import { InstagramPreviewSchema, type AdPreview, type InstagramAdPreview, type TelegramAdPreview, TelegramPreviewSchema } from "../preview";
import { AdAttachementsSchema, type AdAttachments } from "../attachments";
import { type AdPostType, InstagramAdPostType, TelegramAdPostType } from "./post-types";

export type AdPost = ReplaceKeys<PureAdPost, 'preview' | 'attachments' | 'initialType', {
    preview: AdPreview;
    attachments: AdAttachments;
    initialType?: Maybe<AdPostType>;
}>

export type InstagramAdPost = ReplaceKeys<AdPost, 'preview' | 'social' | 'initialType', {
    preview: InstagramAdPreview;
    social: (typeof SocialType)['Instagram'];
    initialType?: InstagramAdPostType;
}>;

export type TelegramAdPost = ReplaceKeys<AdPost, 'preview' | 'social', {
    preview: TelegramAdPreview;
    social: (typeof SocialType)['Telegram']
    initialType?: TelegramAdPostType;
}>;


export type DiscriminatedAdPost =
    | InstagramAdPost
    | TelegramAdPost


export function parseAdPost<T extends PureAdPost>(post: T) {
    if (post.social === 'Instagram') {
        return {
            ...post,
            attachments: AdAttachementsSchema.parse(post.attachments),
            preview: InstagramPreviewSchema.parse(post.preview),
            initialType: post.initialType && Object.values(InstagramAdPostType).includes(post.initialType)
                ? post.initialType as InstagramAdPostType
                : undefined,
            social: 'Instagram'
        } satisfies InstagramAdPost 
    }

    if (post.social === 'Telegram') {
        return {
            ...post,
            attachments: AdAttachementsSchema.parse(post.attachments),
            preview: TelegramPreviewSchema.parse(post.preview),
            initialType: post.initialType && Object.values(TelegramAdPostType).includes(post.initialType)
                ? post.initialType as TelegramAdPostType
                : undefined,
            social: 'Telegram'
        } satisfies TelegramAdPost 
    }

    return 'never' as never;
}

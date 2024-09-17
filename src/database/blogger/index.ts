import type { Blogger as PureBlogger, SocialType } from '@prisma/client'
import type { BloggerPrices, IGBloggerPrices, TGChannelPrices } from './prices';
import { type Category } from './categories';
import type { InstagramBloggerStatistic, TelegramBloggerStatistic } from './statistic';
import {type BloggerAdditionalInfo } from './additional-info';

export type BaseBlogger = ReplaceKeys<PureBlogger, 'prices' | 'categories' | 'statistic', {
    categories: Category[];
    prices: BloggerPrices;
    statistic: null;
}> & BloggerAdditionalInfo;

export type IGBlogger = ReplaceKeys<BaseBlogger, 'prices' | 'statistic' | 'type', {
    prices: IGBloggerPrices;
    statistic: InstagramBloggerStatistic;
    type: (typeof SocialType)['Instagram'];
}>

export type TGChannel = ReplaceKeys<BaseBlogger, 'prices' | 'statistic' | 'type', {
    prices: TGChannelPrices;
    statistic: TelegramBloggerStatistic;
    type: (typeof SocialType)['Telegram'];
}>

export type Blogger =
    | IGBlogger
    | TGChannel

export { parseBlogger } from './utils'
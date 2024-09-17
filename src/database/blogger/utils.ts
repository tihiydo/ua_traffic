import type { Blogger as PureBlogger } from '@prisma/client'
import { bloggerCategoriesSchema } from './categories';
import type { IGBlogger, TGChannel } from '.';
import { IGBloggerPricesSchema, TGChannelPricesSchema } from './prices';
import { InstagramBloggerStatisticSchema, TelegramBloggerStatisticSchema } from './statistic';
import { BloggerAdditionalInfoSchema } from './additional-info';

export const parseBlogger = <T extends PureBlogger>(blogger: T) => {
    const categories = bloggerCategoriesSchema.parse(blogger.categories);
    const additionalInfo = BloggerAdditionalInfoSchema.parse({
        womenPercentage: blogger.womenPercentage ?? null,
        menPercentage: blogger.menPercentage ?? null,
        ageCategory: blogger.ageCategory ?? null,
        cpm: blogger.cpm ?? null,
        cpv: blogger.cpv ?? null,
        channelAge: blogger.channelAge ?? null,
    });

    if (blogger.type === 'Instagram') {
        return {
            ...blogger,
            ...additionalInfo,
            categories,
            prices: IGBloggerPricesSchema.parse(blogger.prices),
            statistic: InstagramBloggerStatisticSchema.parse(blogger.statistic),
            type: 'Instagram'
        } satisfies IGBlogger
    }

    if (blogger.type === 'Telegram') {
        return {
            ...blogger,
            ...additionalInfo,
            categories,
            prices: TGChannelPricesSchema.parse(blogger.prices),
            statistic: TelegramBloggerStatisticSchema.parse(blogger.statistic),
            type: 'Telegram'
        } satisfies TGChannel
    }

    return 'never' as never;
}
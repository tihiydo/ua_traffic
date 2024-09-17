import { type SocialType } from "@prisma/client";
import { IGBloggerPricesSchema, TGChannelPricesSchema } from ".";

export function parseBloggerPrices(type: SocialType, prices: any) {
    if (type === 'Instagram') {
        return IGBloggerPricesSchema.parse(prices)
    }

    if (type === 'Telegram') {
        return TGChannelPricesSchema.parse(prices)
    }

    return 'never' as never;
}
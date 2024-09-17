import { type AdPostType } from "@/database/ad-post/post/post-types";
import type { BloggerPrices } from "@/socials/shared/types";
import type { Blogger } from "@/database/blogger";

export const getBloggerPostTypes = (blogger: Blogger): AdPostType[] => {
    const prices = (blogger.prices as Maybe<BloggerPrices>);
    if (!prices) return [];

    return Object.keys(prices) as AdPostType[];
}
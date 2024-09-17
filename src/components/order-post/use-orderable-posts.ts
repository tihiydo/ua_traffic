import { type AdPostType } from "@/database/ad-post/post/post-types";
import { api } from "@/trpc/react";
import { type Blogger } from "@/database/blogger";

export function useOrderablePosts(blogger: Blogger, postType?: AdPostType) {
    return api.advertisment.posts.getOrderablePosts.useQuery({
        social: blogger.type,
        postType: postType,
    })
}
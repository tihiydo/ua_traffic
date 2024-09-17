import { createTRPCRouter } from "@/server/api/trpc";
import { getMyAdvertismentPostsProcedure } from "./procedures/getMyAdvertismentPost";
import { deleteAdvertismentPostProcedure } from "./procedures/deleteAdvertismentPost";
import { getAdvertismentPostProcedure } from "./procedures/getAdvertsimentPost";
import { getOrderablePostsProcedure } from "./procedures/get-order-posts";
import { sendTgPostPreviewProcedure } from "./procedures/send-tg-post-preview";
import { createAdvertismentPostProcedure } from "./procedures/create-adv-post";

export const advertismentPostsRouter = createTRPCRouter({
    createPost: createAdvertismentPostProcedure,
    getOrderablePosts: getOrderablePostsProcedure,
    getMyPosts: getMyAdvertismentPostsProcedure,
    deletePost: deleteAdvertismentPostProcedure,
    getPost: getAdvertismentPostProcedure,
    sendTgPostPreview: sendTgPostPreviewProcedure
})
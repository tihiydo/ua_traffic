import { createTRPCRouter, moderProcedure } from "@/server/api/trpc";
import { getModerationAdvertismentsProcedure } from "./procedures/get-moderation-advs";
import { moderateAdvertismentProcedure } from "./procedures/moderateAdvertisment";
import { getRequestsProcedure } from "./procedures/get-moder-requests";
import { moderateRequestProcedure } from "./procedures/moderate-request";
import { getPostProcedure } from "./procedures/get-post";
import { getAdvRequestProcedure } from "./procedures/get-request";
import { z } from "zod";
import { deleteAdRequestProcedure } from "./procedures/delete-ad-request";

export const advertismentRouter = createTRPCRouter({
    getModerationAdvertisments: getModerationAdvertismentsProcedure,
    moderateAdvertisment: moderateAdvertismentProcedure,
    getRequests: getRequestsProcedure,
    moderateRequest: moderateRequestProcedure,
    getPost: getPostProcedure,
    getAdvRequest: getAdvRequestProcedure,
    deleteAdRequest: deleteAdRequestProcedure,
    removePost: moderProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
        const removePost = await ctx.db.advertismentPost.delete(
            {
                where:
                {
                    id: input.postId
                }
            })
    })
})
import { moderProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";
import { getModerationBloggersProcedure } from "./procedures/get-moderation-bloggers";
import { acceptBloggerProcedure } from "./procedures/accept-blogger";
import { declineBloggerProcedure } from "./procedures/decline-blogger";
import { toggleBloggerStatus } from "./procedures/toggle-blogger-status";
import { editBloggerProcedure } from "./procedures/edit-blogger";
import { editForceBloggerProcedure } from "./procedures/edit-force-blogger";
import { transactionsRouter } from "./transactions";

export const adminBloggerRouter = createTRPCRouter({
    transactions: transactionsRouter,

    acceptBlogger: acceptBloggerProcedure,
    declineBlogger: declineBloggerProcedure,
    toggleBloggerStatus: toggleBloggerStatus,
    editBlogger: editBloggerProcedure,
    editForceBlogger: editForceBloggerProcedure,
    getModerationBloggers: getModerationBloggersProcedure,
    removeBlogger: moderProcedure.input(z.object({ bloggerId: z.string() })).mutation(async ({ ctx, input }) => {
        await ctx.db.blogger.delete({
            where: {
                id: input.bloggerId
            }
        })
    })
})
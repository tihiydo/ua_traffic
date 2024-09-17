import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { createBloggerProcedure } from "./procedures/createBlogger";
import { updateBloggerProcedure } from "./procedures/updateBlogger";
import { deleteBloggerProcedure } from "./procedures/deleteBlogger";
import { getBloggerProcedure } from "./procedures/getBlogger";
import { getManyBloggersProcedure } from "./procedures/getManyBloggers";
import { getCatalogBloggersProcedure } from "./procedures/get-catalog-bloggers";
import { haveOneChannel } from "./procedures/haveOneChannel";
import { createReviewProcedure } from "./procedures/rateBlogger";
import { z } from "zod";
import { getBloggerPublicViewProcedure } from "./procedures/get-blogger-public-view";
import { transactionsRouter } from "./transactions";
import { getBloggerReviewsProcedure } from './procedures/getBloggerRate';
import { getAverageAcceptanceTime } from './procedures/getAverageAcceptanceTime';


export const bloggerRouter = createTRPCRouter({
    transactions: transactionsRouter,
    getAllMyChannels: protectedProcedure
        .input(z.object({userId: z.string()}).optional())
        .query(async ({ input, ctx }) => {
            const myChannels = await ctx.db.blogger.findMany({
                where: {
                    userId: input?.userId ? input.userId : ctx.session.user.id
                }
            });

            return myChannels;
        }),

    getManyBloggers: getManyBloggersProcedure,
    getBlogger: getBloggerProcedure,
    getBloggerPublicView: getBloggerPublicViewProcedure,
    createBlogger: createBloggerProcedure,
    updateBlogger: updateBloggerProcedure,
    deleteBlogger: deleteBloggerProcedure,
    haveOneChannel: haveOneChannel,
    getCatalogBloggers: getCatalogBloggersProcedure,
    rateBlogger: createReviewProcedure,
    getBloggerRate: getBloggerReviewsProcedure,
    getAverageAcceptanceTime: getAverageAcceptanceTime
})

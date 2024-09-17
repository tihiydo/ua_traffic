import { createTRPCRouter } from "@/server/api/trpc";
import { orderPostProcedure } from "./procedures/orderPost";
import { advertismentPostsRouter } from "./posts";
import { advertismentRequestRouter } from "./requests";
import { acceptAdvetismentProcedure } from "./procedures/acceptAdvertisment";
import { declineAdvertismentProcedure } from "./procedures/declineAdvertisment";
import { markDoneAdvertismentProcedure } from "./procedures/markDoneAdvertisment";
import { getAverageAcceptanceTimeProcedure } from './procedures/getAverageAcceptTime';

export const advertismentRouter = createTRPCRouter({
    posts: advertismentPostsRouter,
    requests: advertismentRequestRouter,

    orderPost: orderPostProcedure,
    acceptRequest: acceptAdvetismentProcedure,
    declineRequest: declineAdvertismentProcedure,
    markDoneAdvertisment: markDoneAdvertismentProcedure,
    getAverageAcceptanceTime: getAverageAcceptanceTimeProcedure,
})

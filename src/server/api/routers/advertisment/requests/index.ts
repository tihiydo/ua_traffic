import { createTRPCRouter } from "@/server/api/trpc";
import { getMyBloggersAdvertismentRequestsProcedure } from "./procedures/getMyBloggersAdvertismentRequests";
import { getAdvertismentRequestProcedure } from "./procedures/getAdvertismentRequest";
import { getMyAdvertiserRequestsProcedure } from "./procedures/getMyAdvertiserRequests";



export const advertismentRequestRouter = createTRPCRouter({
    getMyBloggersRequests: getMyBloggersAdvertismentRequestsProcedure,
    getMyAdvertiserRequests: getMyAdvertiserRequestsProcedure,
    getRequest: getAdvertismentRequestProcedure
});
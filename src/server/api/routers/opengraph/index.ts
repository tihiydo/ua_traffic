import { createTRPCRouter } from "../../trpc";
import { getBloggerPublicViewProceudre } from "./procedures/get-blogger-publice-view";

export const opengraphRouter = createTRPCRouter({
    getBloggerPublicView: getBloggerPublicViewProceudre
})
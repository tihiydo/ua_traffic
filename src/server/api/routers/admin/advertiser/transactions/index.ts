import { createTRPCRouter } from "@/server/api/trpc";
import { getHistoryProcedure } from "./procedures/get-history";

export const transactionsRouter = createTRPCRouter({
    getHistory: getHistoryProcedure
})
import { createTRPCRouter } from "@/server/api/trpc";
import { getMyHistoryProcedure } from "./procedures/get-my-history";
import { transferMoneyProcedure } from './procedures/send-to-advertiser';


export const transactionsRouter = createTRPCRouter({
    getMyHistory: getMyHistoryProcedure,
    transferMoney: transferMoneyProcedure,
})
import { createTRPCRouter } from "@/server/api/trpc";
import { getMyHistoryProcedure } from "./procedures/get-my-history";
import { transferMoneyProcedure } from './procedures/send-to-blogger';

export const transactionsRouter = createTRPCRouter({
    getMyHistoy: getMyHistoryProcedure,
    transferMoney: transferMoneyProcedure,
})
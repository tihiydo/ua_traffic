import { createTRPCRouter } from "@/server/api/trpc";
import { transactionsRouter } from "./transactions";

export const adminAdvertiserRouter = createTRPCRouter({
    transactions: transactionsRouter
})
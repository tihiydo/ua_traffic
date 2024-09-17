import { createTRPCRouter } from "../../trpc";
import { transactionsRouter } from "./transactions";

export const advertiserRouter = createTRPCRouter({
    transactions: transactionsRouter
})
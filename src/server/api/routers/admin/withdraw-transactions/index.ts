import { createTRPCRouter } from "@/server/api/trpc";
import { getTransactionsProcedure } from "./procedures/get-transactions";
import { markAsDoneProcedure } from "./procedures/mark-as-done";

export const withdrawTransactionsRouter = createTRPCRouter({
    getTransactions: getTransactionsProcedure,
    markAsDone: markAsDoneProcedure
})
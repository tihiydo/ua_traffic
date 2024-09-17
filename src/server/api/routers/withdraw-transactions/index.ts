import { createTRPCRouter } from "../../trpc";
import { createTransactionProcedure } from "./procedure/create-transaction";
import { getMyTransactionsProcedure } from "./procedure/get-my-transactions";



export const withdrawTransactionsRouter = createTRPCRouter({
    createTransaction: createTransactionProcedure,
    getMyTransactions: getMyTransactionsProcedure
})
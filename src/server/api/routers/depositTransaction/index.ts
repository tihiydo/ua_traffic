import { createTRPCRouter } from "../../trpc";
import { getMyTransactionsProcedure } from "./procedures/get-my-transactions";
import { requestDepositProcedure } from "./procedures/requestDeposit";


export const depositTransactionRouter = createTRPCRouter({
    requestDeposit: requestDepositProcedure,
    getMyTransactions: getMyTransactionsProcedure
})
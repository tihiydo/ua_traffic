import { createTRPCRouter } from "../../trpc";
import { createRequisitesProcedure } from "./procedures/createRequisites";
import { deleteRequisitesProcedure } from "./procedures/deleteRequisites";
import { getMyRequisitesProcedure } from "./procedures/getMyRequisites";

export const requisitesRouter = createTRPCRouter({
    create: createRequisitesProcedure,
    delete: deleteRequisitesProcedure,
    getMyRequisites: getMyRequisitesProcedure
})
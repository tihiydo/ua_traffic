import { createTRPCRouter } from "../../trpc";
import { checkTaskCompletedProcedure } from "./procedures/check-task-completed";
import { getTasksProgressProcedure } from "./procedures/get-tasks-progress";


export const guideRouter = createTRPCRouter({
    getTasksProgress: getTasksProgressProcedure,
    checkTaskCompleted: checkTaskCompletedProcedure
})
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { checkIsTaskCompleted } from "../utils";

const checkTaskCompletedInput = z.object({
    taskId: z.string()
})

export const checkTaskCompletedProcedure = protectedProcedure
    .input(checkTaskCompletedInput)
    .mutation(async ({ ctx, input }) => {
        const isCompleted = await checkIsTaskCompleted(ctx.session.user.id, input.taskId)

        return isCompleted
    })
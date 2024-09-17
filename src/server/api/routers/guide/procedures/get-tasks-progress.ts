import { protectedProcedure } from "@/server/api/trpc";
import { checkIsTaskCompleted } from "../utils";
import { tasks } from "@/modules/guide/tasks";
import type { TaskProgress, TasksProgress } from "@/modules/guide/types";


export const getTasksProgressProcedure = protectedProcedure

    .query(async ({ ctx }) => {
        const advertiserProgress: TaskProgress[] = await Promise.all(tasks.advertiser.map(async (task) => {
            return {
                completed: await checkIsTaskCompleted(ctx.session.user.id, task.id),
                id: task.id
            } satisfies TaskProgress
        }))

        const bloggerProgress: TaskProgress[] = await Promise.all(tasks.blogger.map(async (task) => {
            return {
                completed: await checkIsTaskCompleted(ctx.session.user.id, task.id),
                id: task.id
            } satisfies TaskProgress
        }))

        const catalogProgress: TaskProgress[] = await Promise.all(tasks.catalog.map(async (task) => {
            return {
                completed: await checkIsTaskCompleted(ctx.session.user.id, task.id),
                id: task.id
            } satisfies TaskProgress
        }))

        return {
            advertiser: advertiserProgress,
            blogger: bloggerProgress,
            catalog: catalogProgress
        } satisfies TasksProgress
    })
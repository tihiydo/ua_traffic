import { viewedBySchema } from "@/modules/notifications";
import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";


const viewNotificationInput = z.object({
    notificationId: z.string(),
});

export const viewNotificationProcedure = protectedProcedure
    .input(viewNotificationInput)
    .mutation(async ({ input, ctx }) => {
        const notification = await ctx.db.notifications.findUnique({
            where: {
                id: input.notificationId
            },
            select: {
                viewedBy: true,
                id: true
            }
        })

        const viewedBy = viewedBySchema.parse(notification?.viewedBy)

        const isViewed = viewedBy.includes(ctx.session.user.id)

        if (!isViewed) {
            viewedBy.push(ctx.session.user.id)

            await ctx.db.notifications.update({
                where: {
                    id: input.notificationId
                },
                data: {
                    viewedBy
                }
            })
        }

        return { notificationId: notification?.id, viewedBy }
    })
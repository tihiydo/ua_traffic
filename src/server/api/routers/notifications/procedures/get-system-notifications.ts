import { adminProcedure } from "@/server/api/trpc";
import { parseNotification } from "../utils";



export const getSystemNotificationsProcedure = adminProcedure
    .query(async ({ ctx }) => {
        const systemNotifications = await ctx.db.notifications.findMany({
            where: {
                notificationType: 'System'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return systemNotifications.map(parseNotification);
    })
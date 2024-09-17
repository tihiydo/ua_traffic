import { protectedProcedure } from "@/server/api/trpc";
import { parseNotification } from "../utils";


export const getMyNotificationsProcedure = protectedProcedure
    .query(async ({ ctx }) => {
        const notifications = await ctx.db.notifications.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            // Get all notifications where recipient is user or everyone
            where: {
                OR: [
                    {
                        recipients: {
                            path: ['data'],
                            array_contains: ctx.session.user.id
                        }
                    },
                    {
                        recipients: {
                            path: ['data'],
                            equals: 'ALL'
                        }
                    }
                ],

            }
        });

        return { notifications: notifications.map(parseNotification), userId: ctx.session.user.id }
    })
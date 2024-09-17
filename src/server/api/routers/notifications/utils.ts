import { recipientsSchema, viewedBySchema } from "@/modules/notifications";
import { type Notifications } from "@prisma/client";

export const parseNotification = (notification: Notifications) => {
    return {
        ...notification,
        recipients: recipientsSchema.parse(notification.recipients),
        viewedBy: viewedBySchema.parse(notification.viewedBy)
    }
}


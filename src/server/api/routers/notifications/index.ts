import { createTRPCRouter } from "../../trpc";
import { createNotificationProcedure } from "./procedures/create-notification";
import { createSystemNotificationProcedure } from "./procedures/create-system-notification";
import { getMyNotificationsProcedure } from "./procedures/get-my-notifications";
import { getSystemNotificationsProcedure } from "./procedures/get-system-notifications";
import { viewNotificationProcedure } from "./procedures/view-notification";

export const notificationsRouter = createTRPCRouter({
    createNotification: createNotificationProcedure,
    createSystemNotification: createSystemNotificationProcedure,
    getSystemNotifications: getSystemNotificationsProcedure,
    getMyNotifications: getMyNotificationsProcedure,
    viewNotification: viewNotificationProcedure
})

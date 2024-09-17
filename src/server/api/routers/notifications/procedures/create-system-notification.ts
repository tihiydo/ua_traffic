import { recipientsSchema } from "@/modules/notifications";
import { moderProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { parseNotification } from "../utils";
import { sendEmails, sendTelegram } from "./api";

const createSystemNotificationInput = z.object({
    recipients: recipientsSchema,
    text: z.string(),
    additionalHref: z.string().optional(),
})



export const createSystemNotificationProcedure = moderProcedure
    .input(createSystemNotificationInput)
    .mutation(async ({ ctx, input }) => {
        const notification = await ctx.db.notifications.create({
            data: {
                recipients: input.recipients,
                text: input.text,
                additionalHref: input.additionalHref,
                notificationType: 'System'
            }
        })

        const parsedNotification = parseNotification(notification);

        sendEmails(parsedNotification);
        sendTelegram(parsedNotification)

        return parsedNotification;
    })
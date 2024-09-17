import { recipientsSchema } from "@/modules/notifications";
import { protectedProcedure } from "@/server/api/trpc";
import { excludeKeys } from "@/utils";
import { NotificationType } from "@prisma/client";
import { z } from "zod";
import { parseNotification } from "../utils";
import { sendEmails, sendTelegram } from "./api";

const createNotificationInput = z.object({
    recipients: recipientsSchema,
    text: z.string(),
    notificationType: z.nativeEnum(excludeKeys(['System'], NotificationType)).optional(),
    additionalHref: z.string().optional(),
    notifyOptions: z.object({
        email: z.boolean(),
        telegram: z.boolean(),
    })
        .partial()
        .optional()
        .default({
            email: true,
            telegram: true
        })
})



export const createNotificationProcedure = protectedProcedure
    .input(createNotificationInput)
    .mutation(async ({ ctx, input }) => {
        // TODO: Remove locale segment from notification link
        console.log('create notification', input)
        const newNotification = await ctx.db.notifications.create({
            data: excludeKeys(['notifyOptions'], input)
        });
        const notification = parseNotification(newNotification);



        if (input.notifyOptions.email) {
            console.log('send email notification')

            sendEmails(notification);
        }

        if (input.notifyOptions.telegram) {
            sendTelegram(notification)
        }

        return notification;
    })

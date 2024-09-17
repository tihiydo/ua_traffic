import type { recipientsSchema, viewedBySchema } from "@/modules/notifications";
import type { Notifications } from "@prisma/client";
import type { z } from "zod";

export type Notification = Notifications & {
    viewedBy: z.infer<typeof viewedBySchema>,
    recipients: z.infer<typeof recipientsSchema>,
}
import { type Locale } from "@/i18n/config";
import { z } from "zod";

const notificationMapItemSchema = z.object({
    content: z.string()
})
type NotificationMapItemSchemaType = z.infer<typeof notificationMapItemSchema>;

export const manualTranslationSchema = z.object({
    ua: notificationMapItemSchema,
    ru: notificationMapItemSchema,
    en: notificationMapItemSchema,
}) satisfies z.ZodType<Record<Locale, NotificationMapItemSchemaType>>


export const translateContentsSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal("string"),
        data: z.string()
    }),
    z.object({
        kind: z.literal("code"),
        code: z.string(),
        values: z.record(z.union([z.string(), z.number(), z.boolean()])).optional()
    }),
    z.object({ 
        kind: z.literal("map"), 
        data: manualTranslationSchema 
    }),
])



import { SocialType } from "@prisma/client"
import { z } from "zod"

export type InstagramAdPreview = z.infer<typeof InstagramPreviewSchema>;
export const InstagramPreviewSchema = z.object({
    social: z.literal(SocialType.Instagram),
    text: z.object({
        position: z.object({
            x: z.number(), y: z.number()
        }),
        bgColor: z.string().optional(),
        align: z.string().optional(),
        textColor: z.string().optional(),
        content: z.string(),
        fontSize: z.number().optional(),
        width: z.number(),
        height: z.number(),
        font: z.string().optional()
    }).optional(),
    link: z.object({
        position: z.object({
            x: z.number(), y: z.number()
        }),
        href: z.string(),
        text: z.string().optional(),
        scale: z.number().optional()
    }).optional(),
    image: z.object({
        position: z.object({
            x: z.number(), y: z.number()
        }),
        href: z.string(),
        scale: z.number().optional()
    }).optional(),
})

export type TelegramAdPreview = z.infer<typeof TelegramPreviewSchema>;
export const TelegramPreviewSchema = z.object({
    social: z.literal(SocialType.Telegram),
    buttons: z.array(z.object({
        display: z.string(),
        url: z.string()
    }))
})

export type AdPreview = z.infer<typeof AdPreviewSchema>;
export const AdPreviewSchema = z.discriminatedUnion('social', [
    InstagramPreviewSchema,
    TelegramPreviewSchema
])
import { z } from "zod";

export const recipientsSchema = z.object({
    data: z.union([z.string().array(), z.literal('ALL')]),
})

export const viewedBySchema = z.array(z.string());
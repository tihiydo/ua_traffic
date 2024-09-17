import { mediaTypes } from "@/constants/mime-types";
import { createUnionSchema } from "@/lib/zod/create-many-union";
import { z } from "zod";

export type AdAttachmentsItem = AdAttachments[number];
export type AdAttachments = z.infer<typeof AdAttachementsSchema>;
export const AdAttachementsSchema = z.array(z.object({
    pathname: z.string(),
    contentType: z.string().optional(),
    url: z.string().url(),
    filename: z.string(),
    mediaType: createUnionSchema(mediaTypes)
}))

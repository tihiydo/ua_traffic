import type { z } from "zod";
import type { translateContentsSchema } from "./schemas";

export type TranslateContents = z.infer<typeof translateContentsSchema>

export type TranslateMessageItem = {
    name: string;
    args: Record<string, string | number | boolean>
}
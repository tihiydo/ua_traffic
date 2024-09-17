import { getMimeTypes } from "@/utils/file";

export const ALLOWED_INSTAGRAM_FILES = getMimeTypes([
    'mp4',
    'heic',
    'jpeg',
    'png',
] as const);
import { getMimeTypes } from '@/utils/file';

export const allowedImgs: string[] = getMimeTypes([
    'jpeg',
    'png'
])

export const allowedExts = [
    'pdf',
    'docx',
    'mp4',
    'heic',
    'jpeg',
    'png',
] as const;

export const allowedFiles: string[] = getMimeTypes(allowedExts);
export const allowedTGFiles: string[] = getMimeTypes([
    'pdf',
    'mp4',
    'heic',
    'jpeg',
    'png',
]);

export type MediaType = (typeof mediaTypes)[number];
export const mediaTypes = ['video', 'photo', 'document', 'audio', 'unknown'] as const;

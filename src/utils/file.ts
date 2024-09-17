import { type MediaType, type allowedExts } from '@/constants/mime-types';
import mime from 'mime';

export function extractExt(data: File | string) {
    let argument = '';

    if (data instanceof File) {
        argument = data.name
    } else if (typeof data === 'string') {
        argument = data
    }

    const dotIndex = argument.lastIndexOf('.');
    if (dotIndex === -1 || dotIndex === argument.length - 1) {
        return null; // No extension found or dot is at the end
    }
    return argument.substring(dotIndex + 1);
}

export function getFileMB(file: File) {
    const size = file.size;
    return Number((size / (1024 * 1024)).toFixed(1));
}


export function getExtMediaType(ext: Maybe<string>): MediaType {
    type MediaTypeMap<T extends string = string> = Record<T, MediaType>;
    if (!ext) return 'unknown';

    const extMime = mime.getType(ext);
    if (!extMime) return 'unknown';

    // Assign ext their media type
    const extMedia: MediaTypeMap<(typeof allowedExts)[number]> = {
        pdf: 'document',
        docx: 'document',
        heic: 'photo',
        mp4: 'video',
        jpeg: 'photo',
        png: 'photo'
    }

    // Replace ext key with ext mime type
    // Because some exts can relate to same mime type 
    const mimeMedia = Object.fromEntries(
        Object.entries(extMedia)
            .map(([ext, mediaType]) => {
                const extMime = mime.getType(ext);

                return [extMime, mediaType];
            })
            .filter(([mime]) => mime != null)
    ) as MediaTypeMap;

    return mimeMedia[extMime] ?? 'unknown'
}

export function getMIMEMediaType(mimeType: Maybe<string>): MediaType {
    if (!mimeType) return 'unknown';

    const ext = mime.getExtension(mimeType)
    if (!ext) return 'unknown'

    return getExtMediaType(ext);
}


export function getMimeTypes(exts: readonly string[]) {
    return exts
        // get mime type
        .map(ext => mime.getType(ext))
        // filter from null mimes
        .filter(mime => mime != null) as string[];
}



export function base64ToBlob(base64String: string, mimeType: string) {
    // Split the base64 string to get the data and mime type
    const [contentTypePart, dataPart] = base64String.split(';base64,');
    if (!contentTypePart || !dataPart) throw new Error('failed base64 to Blob')

    // Extract content type from the data URL
    const contentType = mimeType || contentTypePart.split(':')[1];
    // Decode base64 string
    const byteCharacters = atob(dataPart);
    // Convert to byte array
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    // Create Blob object
    return new Blob([byteArray], { type: contentType });
}

// Function to create File from Blob
export function blobToFile(blob: Blob, fileName: string) {
    // Create a new File object
    const file = new File([blob], fileName, { type: blob.type });
    return file;
}

export function getFileId(file: File) {
    return `${file.name}/${file.size}/${file.type}`
}
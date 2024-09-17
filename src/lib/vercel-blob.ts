import { ERROR_CODES } from "@/constants/error-codes";
import { allowedFiles } from "@/constants/mime-types";
import { getFileId } from "@/utils/file";
import {  type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
// import nodeFetch from 'node-fetch';

export type UploadedFile = {
    file: File;
    fileId: string
} & PutBlobResult

export async function uploadFiles(path: string, files: File[], allowedMimes: string[] = allowedFiles) {
    const blobs = await Promise.all(
        files.map(async file => {
            console.log(file.name)
            const uploadResult = await upload(`${path}/${file.name}`, file, {
                access: 'public',
                handleUploadUrl: '/api/blob/upload?allowed=' + allowedMimes.join(','),
            })

            return {
                ...uploadResult,
                file,
                fileId: getFileId(file)
            } satisfies UploadedFile
        })

    )

    return blobs;
}


// export async function uploadFile(path: string, file: File, allowedMimes: string[] = allowedFiles) {
//     console.log(file.name)
//     const blob = await upload(`test2`, file, {
//         access: 'public',
//         handleUploadUrl: '/api/blob/upload?allowed=' + allowedMimes.join(','),
//     })


//     return blob;
// }


// type UploadFromURLOpts = {
//     path: string;
//     fileName: string;
//     allowedMimes?: string[]
// }
// export async function uploadFromUrl(url: string, opts: UploadFromURLOpts) {
//     const req = await nodeFetch(url);
//     if (!req.ok) {
//         throw new Error(ERROR_CODES.SERVER_ERROR)
//     }

//     const blob = await req.blob();

//     if (opts.allowedMimes && !opts.allowedMimes.includes(blob.type)) {
//         throw new Error(ERROR_CODES.UNALLOWED_FILE)
//     }

//     const uploadedFile = await put(`${opts.path}/${opts.fileName}`, blob, {
//         access: 'public',
//     })

//     return uploadedFile;
// }
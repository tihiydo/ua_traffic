import { type TranslateFn } from "@/types";
import { extractExt, getExtMediaType, getFileMB } from "@/utils/file";
import { z } from "zod";



type Options = {
    maxFiles: number;
    maxVideoSizeMB: number;
    maxFileSizeMB: number;
}

export const getAttachemntsFormSchema = (t: TranslateFn<'Validation'>, options?: Partial<Options>) => {
    options = {
        maxFiles: 1,
        ...options
    }

    return z.array(z.instanceof(File), { required_error: t('required-field') })
        .max(options.maxFiles ?? 1, t('max-files', { count: options.maxFiles }))
        .refine((files) => {
            if (!files) return true;

            return files.every(file => {
                const fileExt = extractExt(file.name);

                return !!fileExt
            })
        }, t('unknown-files'))
        .transform((files) => {
            return files.map(file => {
                // Checked file exts in prev refine
                const fileExt = extractExt(file.name)!;
                const fileMediaType = getExtMediaType(fileExt);
                const fileSize = getFileMB(file);
                
                return {
                    file,
                    fileExt, 
                    fileMediaType,
                    fileSize
                }
            })
        })
        .refine(files => {
            if (!files.length) return true;

            return files.every(file => {
                if (file.fileMediaType === 'video') {
                    const maxVideoSize = options?.maxVideoSizeMB ?? options?.maxVideoSizeMB;
                    if (!maxVideoSize) return true;

                    return file.fileSize <= maxVideoSize;
                } else {
                    if (!options?.maxFileSizeMB) return true;
                    return file.fileSize <= options.maxFileSizeMB;
                }
            })
        }, { message: t('large-unknown-file-size') })
        .transform(files => {
            return files.map(file => {
                return file.file;
            })
        });
}
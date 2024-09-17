import { useEffect, useState } from "react"
import { type UploadedFile, uploadFiles } from '@/lib/vercel-blob'


export const useFileUploads = (...args: Parameters<typeof uploadFiles>) => {
    const [blobs, setBlobs] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [path, files] = args;



    useEffect(() => {
        (async () => {
            setIsLoading(true)
            try {
                const blobs = await uploadFiles(...args);
                setBlobs(blobs);
            } finally {
                setIsLoading(false)
            }
        })()

    }, [path, files])

    return {
        isLoading,
        blobs
    }
}

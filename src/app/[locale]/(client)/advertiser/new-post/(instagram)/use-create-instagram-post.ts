'use client'
import { useErrorTranslate } from "@/hooks/use-error";
import { useRouter } from "@/i18n/navigation";
import { uploadFiles } from "@/lib/vercel-blob";
import { type InstagramAdPostType } from "@/database/ad-post/post/post-types";
import { type InstagramAdPreview } from "@/database/ad-post/preview";
import { api } from "@/trpc/react";
import { extractExt, getExtMediaType } from "@/utils/file";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export function useCreateInstagramPost() {
    const t = useTranslations('Advertiser');
    const messagesT = useTranslations('Messages');
    const router = useRouter();

    const createPost = api.advertisment.posts.createPost.useMutation({
        onSuccess: (post) => {
            toast.success(messagesT('post-created', { postName: post.title }))
            router.push('/advertiser/my-posts')
        },
        onError: (error) => {
            toast.error(translateError(error.message))
        },
    })


    const [isUploading, setIsUploading] = useState(false);
    const translateError = useErrorTranslate();

    const customMutate = useCallback(async (data: {
        files: File[];
    }) => {
        let blobs: Awaited<ReturnType<typeof uploadFiles>> = [];

        try {
            if (data.files) {
                setIsUploading(true);
                blobs = await uploadFiles(`post-attachments`, data.files);
            }
        } catch (error) {
            toast.error(t("cantaddattachment"))
        } finally {
            setIsUploading(false)

        }
        return {
            blobs,
            next: (data: {
                type: InstagramAdPostType;
                title: string;
                content: string;
                preview: InstagramAdPreview
            }) => {
                return createPost.mutate({
                    social: 'Instagram',
                    attachemnts: blobs.map(blob => {
                        const fileExt = extractExt(blob.file.name)!;
                        const fileMediaType = getExtMediaType(fileExt);

                        return {
                            pathname: blob.pathname,
                            contentType: blob.contentType,
                            url: blob.url,
                            filename: blob.file.name,
                            mediaType: fileMediaType
                        }
                    }),
                    content: data.content,
                    title: data.title,
                    type: data.type,
                    preview: data.preview
                });
            }
        }
    }, [createPost, t])

    return {
        ...createPost,
        mutate: customMutate,
        isLoading: createPost.isLoading || isUploading
    }
}
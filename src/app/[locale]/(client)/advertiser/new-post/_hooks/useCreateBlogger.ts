import { useErrorTranslate } from "@/hooks/use-error";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import { useTranslations } from 'next-intl'

export function useCreatePost() {
    const messagesT = useTranslations('Messages')
    const router = useRouter();
    const translateError = useErrorTranslate();

    const createPostMutation = api.advertisment.posts.createPost.useMutation({
        onSuccess: (post) => {
            toast.success(messagesT('post-created', { postName: post.title }))
            router.push('/advertiser/my-posts')
            router.refresh()
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    return createPostMutation;
}
'use client'

import Translate from "@/components/Translate"
import { Button } from "@/components/ui/button"
import AskAction from "@/components/ui/custom/ask-action"
import SpinnerLoading from "@/components/ui/custom/spinner-loading"
import { useErrorTranslate } from "@/hooks/use-error"
import { useRouter } from "@/i18n/navigation"

import { api } from "@/trpc/react"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"

type Props = {
    bloggerId: string
}

const DeleteButton = ({ bloggerId }: Props) => {
    const bloggerT = useTranslations('Blogger');
    const { replace } = useRouter();
    const translateError = useErrorTranslate();
    const { mutateAsync, isLoading } = api.blogger.deleteBlogger.useMutation({
        onSuccess: () => {
            toast.success(bloggerT('channel-deleted'))
            replace('/blogger/my-channels')
        },
        onError: ({ message }) => {
            toast.error(translateError(message))
        }
    });

    return (
        <AskAction onAccept={async () =>
        {
            const request = await mutateAsync({ bloggerId })
        }}>
            <Button
                disabled={isLoading}
                className="w-fit mt-5 self-start"
                variant={'destructive'}
            >
                <Translate namespace="Blogger" itemKey="delete-blogger" />
            </Button>
        </AskAction>
    )
}

export default DeleteButton
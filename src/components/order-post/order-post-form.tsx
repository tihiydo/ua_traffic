'use client'

import { z } from "zod"
import InstagramOrderPostForm from "./instagram-order-form"
import TelegramOrderPostForm from "./telegram-order-form"
import { useTranslations } from "next-intl"
import { useZodSchema } from "@/hooks/use-zod-schema"
import { POST_TIME_INTERVAL } from "./constants"
import { AdPostType, InstagramAdPostType, TelegramAdPostType } from "@/database/ad-post/post/post-types"
import { type Blogger } from "@/database/blogger"


export type OrderPostFormData = {
    postDate: {
        from: Date;
        to: Date;
    }
    postTime: {
        from: Date;
        to: Date;
    }
    jsonAdvertisment: string;
    advertismentType: AdPostType;
}


type Props = {
    blogger: Blogger,
    onSubmit?: (data: OrderPostFormData) => void
    isLoading?: boolean;
    initialPostType?: string | null;
}

const OrderPostForm = ({ blogger, onSubmit, isLoading, initialPostType }: Props) => {
    const validationT = useTranslations('Validation')
    const schema = useZodSchema<OrderPostFormData>(() => {
        const postTypes = blogger.type === 'Instagram'
            ? Object.values(InstagramAdPostType)
            : blogger.type === 'Telegram'
                ? Object.values(TelegramAdPostType)
                : null

        if (!postTypes) {
            throw new Error('Unknown blogger type')
        }

        return z.object({
            postDate: z.object({
                from: z.date(),
                to: z.date(),
            }, { required_error: validationT('required-field') }),
            postTime: z.object({
                from: z.date(),
                to: z.date()
            }, { required_error: validationT('required-field') })
                .refine(timeRange => {
                    return (new Date(timeRange.to).getTime() - new Date(timeRange.from).getTime()) >= POST_TIME_INTERVAL
                }, validationT('min-time-interval', { mins: POST_TIME_INTERVAL / 60_000 })),
            jsonAdvertisment: z.string(),
            advertismentType: z.nativeEnum(AdPostType),
        })
    }, [])

    const commonProps = {
        schema,
        blogger,
        isLoading,
        onSubmit,
        initialPostType
    }

    if (blogger.type === 'Instagram') {
        return <InstagramOrderPostForm {...commonProps} />
    }

    if (blogger.type === 'Telegram') {
        return <TelegramOrderPostForm {...commonProps} />
    }

}

export default OrderPostForm
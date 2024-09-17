'use client'

import { Button } from "@/components/ui/button";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { SendHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod"


type Props = {
    onSubmit?: (data: MessageFormData) => void;
    isLoading?: boolean;
}

const messageFormSchema = z.object({
    message: z.string().min(1)
});
type MessageFormData = z.infer<typeof messageFormSchema>;

const MessageForm = ({ isLoading, onSubmit }: Props) => {
    const t = useTranslations("Chat");
    const form = useForm<MessageFormData>({
        mode: 'onBlur',
        defaultValues: {
            message: ''
        }
    });

    const { control, handleSubmit, reset, watch } = form;

    const message = watch('message');

    return (
        <Form {...form}>
            <form
                onSubmit={
                    handleSubmit((data) => {
                        reset();
                        onSubmit?.(data);
                    })
                }
                className="flex items-center w-full"
            >
                <FormField
                    control={control}
                    name={'message'}
                    render={({ field: { onChange, ...field } }) => (
                        <FormItem
                            className={'relative w-full border flex items-center rounded-lg border-gray-secondary p-1 md:p-2 gap-2 md:gap-5'}
                        >
                            <FormControl>
                                <input
                                    className="w-full outline-none text-sm lg:text-base"
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        onChange(newValue);
                                    }}
                                    disabled={isLoading}
                                    placeholder={t("write-message")}
                                    {...field}
                                />
                            </FormControl>

                            <Button
                                size={'icon'}
                                disabled={isLoading || !message}
                                variant={'ghost'}
                                className="!mt-0"
                            >

                                {isLoading ? (
                                    <SpinnerLoading className="text-gray-secondary" />
                                ) : (
                                    <SendHorizontalIcon size={30} className="text-yellow" />
                                )}
                            </Button>
                        </FormItem>
                    )}
                />


            </form>
        </Form>
    )
}

export default MessageForm
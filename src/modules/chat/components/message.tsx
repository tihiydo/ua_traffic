import { type MessageType } from "../types/message"
import { useEffect, useRef } from "react";
import useOnScreen from "@/hooks/use-on-screen";
import MessageDate from "./message-date";
import ViewCheckmark from "./view-checkmark";
import type { ChatState } from "../types";
import { twMerge } from "tailwind-merge";

type Props = {
    chatState: ChatState;
    message: MessageType;
    onViewed?: (message: MessageType) => void;
};

const Message = ({ message, chatState, onViewed }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const isOnScreen = useOnScreen(ref, '10px');

    const isViewed = message.viewedBy.some(viewer => viewer !== chatState.me?.id)
    const isMine = message.sender.id === chatState.me?.id;

    const isLeft = chatState.me?.role === 'admin'
        ? message.sender.role === 'admin' && 'advertiser'
        : isMine


    useEffect(() => {
        if (isOnScreen) {
            onViewed?.(message)
        }
    }, [isOnScreen, message])

    return (
        <div
            ref={ref}
            className={twMerge(`
                bg-yellow rounded-md max-w-[70%] xl:max-w-[60%] w-fit p-3 xl:p-5 flex relative mb-2 md:mb-4 lg:mb-5`,
            isLeft && "ml-auto"
            )}
        >
            <div className="break-all mr-2 text-xs sm:text-sm md:text-base">{message.content}</div>
            <div className="flex items-center self-end">
                <MessageDate timestamp={message.updatedAt} />
                {chatState.me?.role === 'admin' ? (
                    <ViewCheckmark className="ml-2" isMine={true} isViewed={
                        message.viewedBy.some(viewer => viewer !== message.sender.id)
                    } />

                ) : (
                    <ViewCheckmark className="ml-2" isMine={isMine} isViewed={isViewed} />
                )}
            </div>
        </div>
    )
}

export default Message
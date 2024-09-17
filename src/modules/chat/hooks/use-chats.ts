import { useEffect, useState } from "react";
import { chatSubscribe } from "../api/chat-subscribe";
import type { Chat, ChatState } from "../types";
import type { MessageType } from "../types/message";
import { getMyRole } from "../utils/roles";
import { isChatOver } from "../utils";
import { sleep } from "@/utils";

const getChatStateDefaultValue = (chat: Chat) => {
    return {
        chat,
        isOver: false,
        messages: [],
        lastMessage: null,
        unsubscribe: null,
        me: null
    } satisfies ChatState
}

export function useChats(chats: Chat[]) {
    const [stateChats, setStateChats] = useState<Record<string, ChatState>>(Object.fromEntries(
        chats.map(chat => (
            [chat.id, getChatStateDefaultValue(chat)]
        ))
    ));

    const setChatMessages = (chatId: string, messages: MessageType[]) => {
        setStateChats(stateChats => {
            const chat = chats.find(chat => chat.id === chatId);

            const chatState: Maybe<ChatState> = stateChats[chatId]
                ?? (chat ? getChatStateDefaultValue(chat) : chat);

            if (!chatState) {
                return stateChats
            }

            return {
                ...stateChats,
                [chatState.chat.id]: {
                    ...chatState,
                    messages,
                    lastMessage: messages.at(-1),
                }
            }
        })
    }

    useEffect(() => {
        const run = async function () {
            const chatRoles = await Promise.all(chats.map(async (chat) => {
                const role = await getMyRole(chat)
                return {
                    chatId: chat.id,
                    role
                }
            }))

            const chatsState = await Promise.all(chats.map(chat => {
                const unsubscribe = chatSubscribe(chat.id, (messages) => {
                    setChatMessages(chat.id, messages)
                });
                
                return {
                    chat,
                    isOver: isChatOver(chat),
                    lastMessage: null,
                    me: chatRoles.find(role => role.chatId === chat.id)?.role,
                    messages: [],
                    unsubscribe
                } satisfies ChatState;
            }))

            setStateChats(Object.fromEntries(chatsState.map(chatState => (
                [chatState.chat.id, chatState]
            ))));
        }


        run()

        return () => {
            Object.values(stateChats).forEach(chat => {
                chat.unsubscribe?.()
            })
        }
    }, [chats])

    return stateChats;
}

import { type Prisma } from "@prisma/client"
import type { MessageType } from "./message"
import { type Unsubscribe } from "firebase/firestore";


export type ChatMemberRole = 'blogger' | 'advertiser'| 'moder' | 'admin' | 'unauthorized'

export type ChatMember = {
    id: string;
    name: string
    role: ChatMemberRole;
}

export type Chat = Prisma.ChatGetPayload<{
    include: {
        AdvertismentRequest: {
            include: {
                AdvertismentPost: {
                    include: {
                        Creator: {
                            select: {
                                email: true,
                                id: true
                            }
                        }
                    }
                },
                Blogger: {
                    include: {
                        User: {
                            select: {
                                id: true,
                                email: true,
                                tel: true,
                            }
                        },
                    },
                    select: {
                        username: true,
                        id: true
                    }
                }
            }
        }
    }
}>

export type RealtimeChat = {
    chat: Chat,
    messages: MessageType[] // Should be updated in realtime
}



export type ChatState = {
    messages: MessageType[];
    chat: Chat;
    lastMessage: Maybe<MessageType>;
    isOver: boolean;
    unsubscribe: Maybe<Unsubscribe>;
    me: Maybe<ChatMember>;
}
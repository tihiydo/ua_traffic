import { FIRESTORE_COLLECTIONS } from "@/firebase/constants/collections";
import { getManyDocs } from "@/firebase/utils";
import { type MessageType } from "@/modules/chat/types/message";
import { limit, orderBy, where } from "firebase/firestore";

export async function getLastChatMessage(chatId: string) {
    const message = await getManyDocs<MessageType>(FIRESTORE_COLLECTIONS.MESSAGES,
        where('chatId', '==', chatId),
        orderBy('createdAt', 'desc'),
        limit(1)
    )

    return message?.[0]
}
import { firestore } from "@/firebase";
import { FIRESTORE_COLLECTIONS } from "@/firebase/constants/collections";
import { collection, query, where, type Unsubscribe, onSnapshot } from "firebase/firestore";
import { parseFetchedData } from "@/firebase/utils";
import { type MessageType } from "../types/message";

export function chatSubscribe(
    chatId: string,
    onSnapshotCallback: (messages: MessageType[]) => void
): Unsubscribe {
    const q = query(
        collection(firestore, `/${FIRESTORE_COLLECTIONS.MESSAGES}`),
        where("chatId", "==", chatId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: MessageType[] = [];
        querySnapshot.forEach((doc) => {
            messages.push(
                parseFetchedData(doc) as MessageType
            );
        });

        messages.sort((a, b) => {
            return a.updatedAt - b.updatedAt
        })

        onSnapshotCallback(messages);
    });

    return unsubscribe;
}
import { firestore } from "@/firebase";
import { FIRESTORE_COLLECTIONS } from "@/firebase/constants/collections";
import { arrayUnion, doc, writeBatch } from "firebase/firestore";
import { type MessageType } from "../types/message";

export async function viewMessages(messagesToView: MessageType[], viewedById: string) {
    const batch = writeBatch(firestore);

    messagesToView.forEach(message => {
        const messageRef = doc(firestore, `/${FIRESTORE_COLLECTIONS.MESSAGES}/${message.id}`)
        batch.update(messageRef, {
            viewedBy: arrayUnion(viewedById)
        })
    })

    await batch.commit();
}
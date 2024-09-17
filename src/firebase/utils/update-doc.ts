import {
    doc,
    updateDoc as firestoreUpdateDoc,
} from 'firebase/firestore';
import { firestore } from '..';

export async function updateDoc<TPath extends string, TData extends object>(
    path: TPath,
    data: TData
) {
    try {
        const docRef = doc(firestore, path);

        await firestoreUpdateDoc(docRef, data);
    } catch (error) {
        console.error(`Could not update document with path: ${path}`, error);
    }
}

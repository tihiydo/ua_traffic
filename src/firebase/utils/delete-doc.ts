import {
    doc,
    deleteDoc as firestoreDeleteDoc,
} from 'firebase/firestore';
import { firestore } from '..';

export async function deleteDoc<TPath extends string>(
    path: TPath,
) {
    try {
        const docRef = doc(firestore, path);

        await firestoreDeleteDoc(docRef);
    } catch (error) {
        console.error(`Could not delete document from collection: ${path}`, error);
    }
}
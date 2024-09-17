import {
    collection,
    addDoc as firestoreAddDoc,
} from 'firebase/firestore';
import { firestore } from '..';

export async function addDoc<TPath extends string, TData extends object>(
    path: TPath,
    data: TData
): Promise<Maybe<string>> {
    try {
        const collectionRef = collection(firestore, path);

        const result = await firestoreAddDoc(collectionRef, data);
        return result.id;
    } catch (error) {
        console.error(`Could not add document into collection: ${path}`, error);
    }
}

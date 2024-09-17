import { doc, getDoc as firestoreGetDoc } from 'firebase/firestore';
import { firestore } from '..';
import { parseFetchedData } from '.';

export async function getDoc<TPath extends string, TReturn extends object>(
    path: TPath,
): Promise<Maybe<TReturn>> {
    try {
        const docRef = doc(firestore, path);

        const result = await firestoreGetDoc(docRef);
        return parseFetchedData(result) as TReturn;
    } catch (error) {
        console.error(`Could not read document with path: ${path}`, error);
    }
}

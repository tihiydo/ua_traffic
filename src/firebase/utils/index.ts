import { type DocumentSnapshot } from 'firebase/firestore';
import { getDoc } from './get-doc';
import { addDoc } from './add-doc';
import { updateDoc } from './update-doc';
import { deleteDoc } from './delete-doc';
import { getManyDocs } from './get-many-docs';

export const parseFetchedData = (snapshot: DocumentSnapshot) => {
    if (!snapshot.exists()) {
        throw new Error(`Doc with path: ${snapshot.ref.path} doesn't exist`);
    }

    return {
        ...snapshot.data(),
        id: snapshot.id,
    };
};

export { getDoc, addDoc, updateDoc, getManyDocs, deleteDoc };

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD06PBZRYi8tt4mZKu1mmA4p0NyOS-y258",
    authDomain: "uatraffic-24a2a.firebaseapp.com",
    projectId: "uatraffic-24a2a",
    storageBucket: "uatraffic-24a2a.appspot.com",
    messagingSenderId: "348988793874",
    appId: "1:348988793874:web:83d33718962219baeba4cb",
    measurementId: "G-HW9WY3BKGT"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);